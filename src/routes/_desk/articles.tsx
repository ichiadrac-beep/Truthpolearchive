import { createFileRoute } from "@tanstack/react-router";
import { DeskStub } from "@/components/desk-stub";

export const Route = createFileRoute("/_desk/articles")({
  component: ArticlesPage,
});

function ArticlesPage() {
  return (
    <DeskStub
      kicker="ARTICLES"
      title="Desk notes"
      body="Long-form briefings will land here. The archive desks stay the primary record."
    />
  );
}
