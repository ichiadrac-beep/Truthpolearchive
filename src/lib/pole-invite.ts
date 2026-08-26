import { appUrl } from "@/lib/app-url";

export function poleJoinUrl() {
  if (typeof window === "undefined") return "/the-pole";
  const origin = window.location.origin;
  if (/grok-sandbox\.com|localhost|127\.0\.0\.1/i.test(origin)) {
    return "https://thetruth-polearchive.grok.me/the-pole";
  }
  return appUrl("/the-pole");
}

export function classifiedJoinRequest(url = poleJoinUrl()) {
  return [
    "CLASSIFIED // JOIN REQUEST",
    "DESK: TRUTHPOLE",
    "CHANNEL: THE POLE",
    "CLEARANCE: GUEST",
    "",
    "You are requested to report to the live channel.",
    "Anonymous. Ephemeral. No account required.",
    "",
    url,
  ].join("\n");
}

export function classifiedJoinTweet(url = poleJoinUrl()) {
  return `CLASSIFIED // JOIN REQUEST — TRUTHPOLE · THE POLE. Guest channel. Ephemeral. Report if able.\n${url}`;
}

export function xFollowersInviteHref(url = poleJoinUrl()) {
  return `https://x.com/intent/tweet?text=${encodeURIComponent(classifiedJoinTweet(url))}`;
}

export function xDmInviteHref() {
  return "https://x.com/messages";
}

async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    /* fall through */
  }
  try {
    const input = document.createElement("textarea");
    input.value = text;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.left = "-9999px";
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    return true;
  } catch {
    return false;
  }
}

type ContactLike = { name?: string[]; tel?: string[]; email?: string[] };

async function pickContacts(): Promise<ContactLike[] | null> {
  const nav = navigator as Navigator & {
    contacts?: {
      select: (props: string[], opts?: { multiple?: boolean }) => Promise<ContactLike[]>;
    };
  };
  if (!nav.contacts?.select) return null;
  try {
    return await nav.contacts.select(["name", "tel", "email"], { multiple: true });
  } catch {
    return [];
  }
}

export async function inviteContacts(): Promise<"shared" | "sms" | "mail" | "copied" | "aborted"> {
  const url = poleJoinUrl();
  const text = classifiedJoinRequest(url);
  const picked = await pickContacts();
  if (picked && picked.length > 0) {
    const tels = picked.flatMap((c) => c.tel ?? []).filter(Boolean);
    const emails = picked.flatMap((c) => c.email ?? []).filter(Boolean);
    if (tels.length) {
      const ios = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      const sep = ios ? "&" : "?";
      window.location.href = `sms:${tels.slice(0, 8).join(",")}${sep}body=${encodeURIComponent(text)}`;
      return "sms";
    }
    if (emails.length) {
      window.location.href = `mailto:${emails.slice(0, 8).join(",")}?subject=${encodeURIComponent("CLASSIFIED // JOIN REQUEST")}&body=${encodeURIComponent(text)}`;
      return "mail";
    }
  }
  const payload = { title: "TRUTHPOLE · THE POLE", text, url };
  if (typeof navigator.share === "function") {
    try {
      const can = typeof navigator.canShare === "function" ? navigator.canShare(payload) : true;
      if (can) {
        await navigator.share(payload);
        return "shared";
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return "aborted";
      if (err instanceof Error && err.name === "AbortError") return "aborted";
    }
  }
  await writeClipboard(text);
  return "copied";
}

export async function copyJoinRequest() {
  await writeClipboard(classifiedJoinRequest());
}

export async function inviteXDms(): Promise<"copied"> {
  await writeClipboard(classifiedJoinRequest());
  window.open(xDmInviteHref(), "_blank", "noopener,noreferrer");
  return "copied";
}
