import { createFileRoute } from "@tanstack/react-router";
import { FileDesk } from "@/components/file-desk";
import { ANCIENT_FILES } from "@/lib/ancient-files";

export const Route = createFileRoute("/_desk/ancient")({
  component: AncientPage,
});

function AncientPage() {
  return (
    <FileDesk
      section="ANCIENT"
      title="Pre-modern contact"
      intro="Sites and objects that contact literature claims as visits. Each file carries one image and the archaeological record beside the claim."
      tag="ANCIENT FILE"
      files={ANCIENT_FILES}
    />
  );
}
