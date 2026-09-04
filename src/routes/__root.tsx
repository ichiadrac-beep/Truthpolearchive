import { lazy, Suspense } from "react";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { FxRoot } from "@/components/fx-root";
import "../styles.css";
import "../crt.css";
import "../presence.css";
import appCss from "../styles.css?url";

const PresenceHud = lazy(() =>
  import("@/components/presence-hud").then((m) => ({ default: m.PresenceHud })),
);

const APP_NAME = "TRUTHPOLE";

/** In dev, Vite serves `/src/styles.css` as JS unless `?direct` or Accept: text/css. */
const cssHref = import.meta.env.DEV
  ? `${appCss}${String(appCss).includes("?") ? "&" : "?"}direct`
  : appCss;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content",
      },
      { title: APP_NAME },
      { name: "description", content: "TRUTHPOLE — The Archive. A classified desk for UAP files." },
      { name: "theme-color", content: "#050506" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/logo-alien.png" },
      { rel: "stylesheet", href: cssHref },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preload", as: "image", href: "/logo-alien.webp", type: "image/webp" },
      {
        rel: "preload",
        as: "font",
        href: "/fonts/rajdhani-600.woff2",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
    ],
    styles: [
      {
        children:
          'html,body{background:#050506;color:#f3f3f1;min-height:100dvh;margin:0;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;}.landing-cta{display:flex;flex-direction:column;width:100%;gap:0.75rem;isolation:isolate;position:relative;z-index:30;opacity:1!important;filter:none!important;transform:none!important;animation:none!important}.landing-cta a,.landing-cta button{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;max-width:100%;box-sizing:border-box;opacity:1;filter:none;animation:none;pointer-events:auto;touch-action:manipulation;position:relative;z-index:30}.landing-tonight{display:flex;flex-direction:column;align-items:center;justify-content:center;isolation:isolate;width:100%;min-height:3.5rem;gap:2px;border:0;border-radius:999px;background:color-mix(in oklab,#f3f3f1 10%,#101012);color:#f3f3f1;box-shadow:inset 0 1px 0 rgba(255,255,255,.42),0 0 0 1px rgba(255,255,255,.28);opacity:1!important;filter:none!important;animation:none!important}.landing-tonight-kicker{font-size:11px;letter-spacing:.22em;color:rgba(243,243,241,.88)}.landing-tonight-title{font-size:15px;font-weight:500;color:#f3f3f1}',
      },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  return (
    <html
      lang="en"
      className="dark antialiased"
      suppressHydrationWarning
      style={{ background: "#050506", color: "#f3f3f1" }}
    >
      <head>
        <HeadContent />
      </head>
      <body
        className="bg-bg text-fg font-mono"
        style={{ background: "#050506", color: "#f3f3f1", minHeight: "100dvh" }}
      >
        <PreviewHostBridge />
        <AuthProvider>
          <div className="phone-stage">
            <FxRoot />
            <Suspense fallback={null}>
              <PresenceHud />
            </Suspense>
            <Outlet />
          </div>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
