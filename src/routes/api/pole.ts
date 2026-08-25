import { createFileRoute } from "@tanstack/react-router";
import { poleHeartbeat, poleSend } from "@/lib/pole.server";

type Body = {
  guestId?: string;
  body?: string;
  anon?: boolean;
  displayName?: string;
  scif?: { code?: string; title?: string };
  heartbeat?: boolean;
};

async function readBody(request: Request): Promise<Body> {
  try {
    return (await request.json()) as Body;
  } catch {
    return {};
  }
}

export const Route = createFileRoute("/api/pole")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const guestId = url.searchParams.get("guestId") || "guest";
        const payload = await poleHeartbeat(guestId);
        return Response.json(payload);
      },
      POST: async ({ request }) => {
        const data = await readBody(request);
        const guestId = data.guestId || "guest";
        if (data.body && !data.heartbeat) {
          const payload = await poleSend({
            guestId,
            body: data.body,
            anon: data.anon,
            displayName: data.displayName,
            scifCode: data.scif?.code,
            scifTitle: data.scif?.title,
          });
          return Response.json(payload);
        }
        const payload = await poleHeartbeat(guestId);
        return Response.json(payload);
      },
    },
  },
});
