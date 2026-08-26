import { createFileRoute } from "@tanstack/react-router";
import { gatherXFeed, X_FEED_SEED, type XFeedPost } from "@/lib/x-feed";

function withoutDesk(posts: XFeedPost[]) {
  return posts.filter((p) => p.handle && p.handle.toLowerCase() !== "desk");
}

export const Route = createFileRoute("/api/x-feed")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const live = withoutDesk(await gatherXFeed());
          if (live.length > 0) {
            return Response.json({ posts: live, source: "api" });
          }
        } catch {
          /* fall through to seed */
        }
        return Response.json({ posts: withoutDesk(X_FEED_SEED), source: "seed" });
      },
    },
  },
});
