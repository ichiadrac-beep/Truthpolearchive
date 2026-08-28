import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { GlassButton } from "@/components/glass-button";
import {
  classifiedJoinRequest,
  copyJoinRequest,
  inviteContacts,
  inviteXDms,
  xFollowersInviteHref,
} from "@/lib/pole-invite";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function PoleInvitePanel({ open, onClose }: Props) {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const flash = (msg: string) => {
    setNote(msg);
    window.setTimeout(() => setNote(""), 2400);
  };

  return (
    <>
      <style>{`
        .pole-invite-scrim{position:fixed;inset:0;z-index:45;border:0;background:color-mix(in oklab,#050506 72%,transparent);cursor:pointer}
        .pole-invite-sheet{position:fixed;z-index:50;left:50%;bottom:calc(6.1rem + env(safe-area-inset-bottom,0px));width:min(22rem,calc(100% - 1.5rem));max-height:min(62dvh,28rem);overflow-y:auto;overscroll-behavior:contain;padding:0.85rem 0.75rem 0.95rem;border-radius:1.5rem;transform:translateX(-50%);-webkit-overflow-scrolling:touch;background-color:#0a0a0c;box-shadow:0 -8px 32px color-mix(in oklab,#000 55%,transparent)}
      `}</style>
      <button type="button" aria-label="Close invite" className="pole-invite-scrim" onClick={onClose} />
      <div role="dialog" aria-label="Issue clearance" className="pole-invite-sheet glass-sheet">
        <div className="flex items-start justify-between gap-2 px-1">
          <p className="font-display text-[10px] tracking-[0.28em] text-fg/55">ISSUE CLEARANCE</p>
          <GlassButton variant="icon" className="size-9 shrink-0" aria-label="Close" onClick={onClose}>
            <X className="size-3.5" strokeWidth={1.7} />
          </GlassButton>
        </div>
        <pre className="mt-2 max-h-[20vh] overflow-y-auto whitespace-pre-wrap break-words font-sans text-[13px] leading-relaxed text-fg/85">
          {classifiedJoinRequest()}
        </pre>
        <div className="mt-3 flex flex-col gap-2">
          <GlassButton
            variant="chip"
            className="h-11 w-full justify-center"
            onClick={() => {
              void inviteContacts().then((result) => {
                if (result === "aborted") return;
                if (result === "sms") flash("Opened messages for contacts.");
                else if (result === "mail") flash("Opened mail for contacts.");
                else if (result === "shared") flash("Join request handed off.");
                else flash("Copied. Paste to a contact.");
              });
            }}
          >
            Invite contacts
          </GlassButton>
          <GlassButton variant="chip" className="h-11 w-full justify-center" asChild>
            <a href={xFollowersInviteHref()} target="_blank" rel="noopener noreferrer">
              X followers
            </a>
          </GlassButton>
          <GlassButton
            variant="chip"
            className="h-11 w-full justify-center"
            onClick={() => {
              void inviteXDms().then(() => flash("Copied. Paste into an X DM."));
            }}
          >
            X DMs
          </GlassButton>
          <GlassButton
            variant="ghost"
            className="h-11 w-full justify-center"
            onClick={() => {
              void copyJoinRequest().then(() => flash("Join request copied."));
            }}
          >
            Copy request
          </GlassButton>
        </div>
        {note ? (
          <p className="mt-2 font-display text-[11px] tracking-[0.16em] text-fg/55" role="status">
            {note}
          </p>
        ) : (
          <p className="mt-2 text-[12px] leading-relaxed text-fg/45">
            Contacts use the device share sheet. Followers open a classified post. DMs copy the
            request so you can paste it.
          </p>
        )}
      </div>
    </>
  );
}
