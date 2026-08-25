import { createFileRoute } from "@tanstack/react-router";
import { gatherArticles } from "@/lib/articles-gather";
import { ARTICLE_SEED } from "@/lib/articles";

export const Route = createFileRoute("/api/articles")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const articles = await gatherArticles();
          return Response.json({ articles: articles.length ? articles : ARTICLE_SEED });
        } catch {
          return Response.json({ articles: ARTICLE_SEED });
        }
      },
    },
  },
});
