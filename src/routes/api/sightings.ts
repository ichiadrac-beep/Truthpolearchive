import { createFileRoute } from "@tanstack/react-router";
import {
  addSightingComment,
  fileSighting,
  listSightings,
  toggleSightingLike,
} from "@/lib/sightings.server";

type Body = {
  guestId?: string;
  alias?: string;
  action?: "list" | "file" | "like" | "comment";
  sightingId?: string;
  body?: string;
  title?: string;
  location?: string;
  incidentDate?: string;
  description?: string;
  extra?: string;
  imageData?: string;
  imageName?: string;
  videoData?: string;
  videoName?: string;
};

async function readBody(request: Request): Promise<Body> {
  try {
    return (await request.json()) as Body;
  } catch {
    return {};
  }
}

export const Route = createFileRoute("/api/sightings")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const guestId = url.searchParams.get("guestId") || "guest";
        return Response.json(await listSightings(guestId));
      },
      POST: async ({ request }) => {
        const data = await readBody(request);
        const guestId = data.guestId || "guest";
        const action = data.action || "list";
        if (action === "file") {
          return Response.json(
            await fileSighting({
              guestId,
              alias: data.alias,
              title: data.title || "",
              location: data.location,
              incidentDate: data.incidentDate,
              description: data.description || "",
              extra: data.extra,
              imageData: data.imageData,
              imageName: data.imageName,
              videoData: data.videoData,
              videoName: data.videoName,
            }),
          );
        }
        if (action === "like" && data.sightingId) {
          return Response.json(await toggleSightingLike(guestId, data.sightingId));
        }
        if (action === "comment" && data.sightingId) {
          return Response.json(
            await addSightingComment({
              guestId,
              sightingId: data.sightingId,
              body: data.body || "",
              alias: data.alias,
            }),
          );
        }
        return Response.json(await listSightings(guestId));
      },
    },
  },
});
