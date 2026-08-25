import { createFileRoute } from "@tanstack/react-router";
import { X_FEED_SEED } from "@/lib/x-feed";

export const Route = createFileRoute("/api/x-feed")({
  server: {
    handlers: {
      GET: async () =>
        Response.json({
          posts: X_FEED_SEED,
        }),
    },
  },
});
