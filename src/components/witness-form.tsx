import { useRef, useState, type FormEvent, type ReactNode, type RefObject } from "react";
import { GlassButton } from "@/components/glass-button";
import { submitFiling, type FilingRow } from "@/lib/desk-api";

type WitnessFormProps = {
  onFiled: (item: FilingRow) => void;
  onCancel?: () => void;
};

const empty = {
  title: "",
  location: "",
  date: "",
  extra: "",
  description: "",
};

async function readDataUrl(file: File, maxBytes: number) {
  if (file.size > maxBytes) return "";
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

async function shrinkImage(file: File) {
  if (!file.type.startsWith("image/")) return readDataUrl(file, 420_000);
  try {
    const bitmap = await createImageBitmap(file);
    const max = 720;
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return readDataUrl(file, 420_000);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.72);
  } catch {
    return readDataUrl(file, 420_000);
  }
}

export function WitnessForm({ onFiled, onCancel }: WitnessFormProps) {
  const [values, setValues] = useState(empty);
  const [imageName, setImageName] = useState<string>();
  const [videoName, setVideoName] = useState<string>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const title = values.title.trim();
    const description = values.description.trim();
    if (!title || !description || busy) return;
    setBusy(true);
    setError(undefined);
    try {
      const imageData = imageFile ? await shrinkImage(imageFile) : "";
      const videoData = videoFile ? await readDataUrl(videoFile, 900_000) : "";
      const result = await submitFiling({
        data: {
          title,
          location: values.location.trim(),
          incidentDate: values.date,
          description,
          extra: values.extra.trim(),
          imageData,
          imageName,
          videoData,
          videoName,
        },
      });
      onFiled({
        id: result.id,
        title,
        location: values.location.trim(),
        incidentDate: values.date,
        description,
        extra: values.extra.trim(),
        imageData: imageData || undefined,
        imageName,
        videoData: videoData || undefined,
        videoName,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      setValues(empty);
      setImageName(undefined);
      setVideoName(undefined);
      setImageFile(null);
      setVideoFile(null);
      if (imageRef.current) imageRef.current.value = "";
      if (videoRef.current) videoRef.current.value = "";
      setDone(true);
    } catch {
      setError("Could not file. Try again.");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="glass-sheet flex flex-col rounded-2xl px-4 py-5" role="status" aria-live="polite">
        <p className="font-display text-xs font-medium tracking-kicker text-signal">FILED</p>
        <p className="mt-2 font-display text-lg font-semibold tracking-tight text-fg">On the witness desk.</p>
        <p className="mt-2 max-w-prose text-sm leading-normal text-muted">
          Guest or signed-in. A photo or video lands on Witness files for others to like and note.
        </p>
        <GlassButton className="mt-4 w-full" variant="ghost" onClick={() => setDone(false)}>
          File another
        </GlassButton>
      </div>
    );
  }

  return (
    <form className="filing-form flex flex-col gap-3" onSubmit={onSubmit} autoComplete="off">
      <p className="font-display text-xs font-medium tracking-[0.22em] text-fg/75">GUEST FILING — NO LOGIN REQUIRED</p>
      <Field label="Title" htmlFor="filing-title">
        <input
          id="filing-title"
          className="glass-field"
          value={values.title}
          onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
          placeholder="Short name for the incident"
          required
          maxLength={120}
        />
      </Field>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Location" htmlFor="filing-location">
          <input
            id="filing-location"
            className="glass-field"
            value={values.location}
            onChange={(e) => setValues((v) => ({ ...v, location: e.target.value }))}
            placeholder="Place, region, country"
            maxLength={120}
          />
        </Field>
        <Field label="Date" htmlFor="filing-date">
          <input
            id="filing-date"
            className="glass-field"
            type="date"
            value={values.date}
            onChange={(e) => setValues((v) => ({ ...v, date: e.target.value }))}
          />
        </Field>
      </div>
      <Field label="What happened" htmlFor="filing-body">
        <textarea
          id="filing-body"
          className="glass-field min-h-28 resize-y"
          value={values.description}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
          placeholder="What moved, how long, sound, sky, other witnesses."
          required
          maxLength={2000}
        />
      </Field>
      <Field label="More detail" htmlFor="filing-extra">
        <textarea
          id="filing-extra"
          className="glass-field min-h-20 resize-y"
          value={values.extra}
          onChange={(e) => setValues((v) => ({ ...v, extra: e.target.value }))}
          placeholder="Craft shape, color, altitude, weather, military nearby — anything else."
          maxLength={1200}
        />
      </Field>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FilePick
          id="filing-image"
          label="Image"
          accept="image/*"
          name={imageName}
          inputRef={imageRef}
          onFile={(file) => {
            setImageFile(file);
            setImageName(file?.name);
          }}
        />
        <FilePick
          id="filing-video"
          label="Video"
          accept="video/*"
          name={videoName}
          inputRef={videoRef}
          onFile={(file) => {
            setVideoFile(file);
            setVideoName(file?.name);
          }}
        />
      </div>
      {error ? <p className="text-sm text-signal">{error}</p> : null}
      <div className="flex flex-col gap-2 sm:flex-row">
        <GlassButton type="submit" disabled={busy} className="flex-1">
          {busy ? "Filing…" : "Submit for review"}
        </GlassButton>
        {onCancel ? (
          <GlassButton type="button" variant="ghost" className="flex-1" onClick={onCancel}>
            Cancel
          </GlassButton>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5" htmlFor={htmlFor}>
      <span className="font-display text-xs font-medium tracking-[0.18em] text-fg/80">{label}</span>
      {children}
    </label>
  );
}

function FilePick({
  id,
  label,
  accept,
  name,
  inputRef,
  onFile,
}: {
  id: string;
  label: string;
  accept: string;
  name?: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onFile: (file: File | null) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-display text-xs font-medium tracking-[0.18em] text-fg/80">{label}</span>
      <label htmlFor={id} className="filing-pick inline-flex min-h-11 cursor-pointer items-center rounded-xl px-3 text-sm text-fg">
        <input
          id={id}
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
        <span className="truncate">{name ?? `Choose ${label.toLowerCase()}`}</span>
      </label>
    </div>
  );
}
