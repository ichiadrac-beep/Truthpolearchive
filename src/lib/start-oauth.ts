import { authClient, signIn } from "@/lib/auth/client";
import { appUrl } from "@/lib/app-url";

function inLivePreview() {
  return typeof window !== "undefined" && window.location.hostname.endsWith(".grok-sandbox.com");
}

/** Open OAuth in a new tab so the X/Google app cannot steal this page. */
export function openOAuthTab() {
  if (typeof window === "undefined") return null;
  return window.open("about:blank", `tp-oauth-${Date.now()}`, "width=520,height=740");
}

function assignOAuth(url: string, tab: Window | null) {
  if (tab && !tab.closed) {
    try {
      tab.location.href = url;
      tab.focus();
      return;
    } catch {
      /* fall through */
    }
  }
  window.location.assign(url);
}

async function sessionReady() {
  try {
    const { data } = await authClient.getSession();
    return Boolean(data?.user);
  } catch {
    return false;
  }
}

async function waitForSession(ms = 180000) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    if (await sessionReady()) return true;
    await new Promise((r) => setTimeout(r, 1400));
  }
  return false;
}

/**
 * Start Google/X sign-in on the public site.
 * Live preview keeps the existing popup. Phones open a browser tab so the X app
 * does not swallow the return.
 */
export async function startOAuth(
  providerId: string,
  dest: string,
  errorDest: string,
  tab: Window | null = null,
): Promise<"ok" | "waiting" | "failed"> {
  const callbackURL = appUrl(dest);
  const errorCallbackURL = appUrl(errorDest);

  if (inLivePreview()) {
    await signIn(providerId, { callbackURL, errorCallbackURL });
    return "ok";
  }

  try {
    await authClient.signOut();
  } catch {
    /* no prior session */
  }

  const { data, error } = await authClient.signIn.oauth2({
    providerId,
    callbackURL,
    errorCallbackURL,
    disableRedirect: true,
  });
  if (error || !data?.url) {
    try {
      tab?.close();
    } catch {
      /* ignore */
    }
    throw new Error(error?.message ?? "Sign-in failed");
  }

  assignOAuth(data.url, tab);

  if (tab && !tab.closed) {
    const ok = await waitForSession();
    if (ok) {
      window.location.replace(callbackURL);
      return "ok";
    }
    return "waiting";
  }

  return "ok";
}
