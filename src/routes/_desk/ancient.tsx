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
      intro="Sites, tablets, and contact claims from the deep past — megaliths, Anunnaki, Watchers, flood teachers, and the pre-biblical sky files. Archaeology first; the descent story is in the dossier."
      tag="ANCIENT FILE"
      files={ANCIENT_FILES}
    />
  );
}
