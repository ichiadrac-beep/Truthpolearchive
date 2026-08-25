import { createFileRoute } from "@tanstack/react-router";
import { SupportDesk } from "@/components/support-desk";

export const Route = createFileRoute("/_desk/support")({
  component: SupportPage,
});

function SupportPage() {
  return <SupportDesk />;
}
