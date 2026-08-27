import { createFileRoute } from "@tanstack/react-router";
import { FileDesk } from "@/components/file-desk";
import { ANCIENT_FILES } from "@/lib/ancient-files";

type AncientSearch = {
  file?: string;
};

export const Route = createFileRoute("/_desk/ancient")({
  validateSearch: (search: Record<string, unknown>): AncientSearch => {
    if (typeof search.file === "string" && search.file) return { file: search.file };
    return {};
  },
  component: AncientPage,
});

function AncientPage() {
  const { file } = Route.useSearch();
  return (
    <FileDesk
      section="ANCIENT"
      title="Pre-modern contact"
      intro="Sites, tablets, and contact claims from the deep past — megaliths, Anunnaki, Watchers, flood teachers, and the pre-biblical sky files. Archaeology first; the descent story is in the dossier."
      tag="ANCIENT FILE"
      files={ANCIENT_FILES}
      deskPath="/ancient"
      seedId={file}
    />
  );
}
