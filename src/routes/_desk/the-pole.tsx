import { createFileRoute } from "@tanstack/react-router";
import { PoleDesk } from "@/components/pole-desk";

export const Route = createFileRoute("/_desk/the-pole")({
  component: ThePolePage,
});

function ThePolePage() {
  return <PoleDesk />;
}
