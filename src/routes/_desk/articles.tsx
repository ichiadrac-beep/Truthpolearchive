import { createFileRoute } from "@tanstack/react-router";
import { ArticlesDesk } from "@/components/articles-desk";

export const Route = createFileRoute("/_desk/articles")({
  component: ArticlesPage,
});

function ArticlesPage() {
  return <ArticlesDesk />;
}
