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
      intro="Sites and objects from the deep past — megaliths, lost cities, and the contact claims attached to them. Archaeology first; the sky-god reading is in the file, not the headline."
      tag="ANCIENT FILE"
      files={ANCIENT_FILES}
    />
  );
}
