import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { FxRoot } from "@/components/fx-root";
import "../styles.css";
import appCss from "../styles.css?url";

const APP_NAME = "TRUTHPOLE";

/** In dev, Vite serves `/src/styles.css` as JS unless `?direct` or Accept: text/css. */
const cssHref = import.meta.env.DEV
  ? `${appCss}${String(appCss).includes("?") ? "&" : "?"}direct`
  : appCss;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      { name: "description", content: "TRUTHPOLE — The Archive. A classified desk for UAP files." },
      { name: "theme-color", content: "#050506" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/logo-alien.png" },
      { rel: "stylesheet", href: cssHref },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Rajdhani:wght@500;600;700&display=swap",
      },
      { rel: "preload", as: "image", href: "/logo-alien.png" },
      { rel: "preload", as: "image", href: "/alien-hand.jpg?v=2" },
      { rel: "preload", as: "audio", href: "/audio/scan.mp3" },
      { rel: "preload", as: "audio", href: "/audio/access-granted.mp3" },
    ],
    styles: [
      {
        children:
          "html,body{background:#050506;color:#f3f3f1;min-height:100dvh;margin:0;}.shoot-star{opacity:0;}.landing-cta{display:flex;flex-direction:column;width:100%;gap:0.75rem}.landing-cta a{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;max-width:100%;box-sizing:border-box}",
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
        className="bg-bg text-fg font-sans"
        style={{ background: "#050506", color: "#f3f3f1", minHeight: "100dvh" }}
      >
        <PreviewHostBridge />
        <AuthProvider>
          <FxRoot />
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
