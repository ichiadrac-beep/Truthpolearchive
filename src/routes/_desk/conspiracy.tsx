import { createFileRoute } from "@tanstack/react-router";
import { FileDesk } from "@/components/file-desk";
import { CONSPIRACY_FILES } from "@/lib/conspiracy-files";

type ConspiracySearch = {
  file?: string;
};

export const Route = createFileRoute("/_desk/conspiracy")({
  validateSearch: (search: Record<string, unknown>): ConspiracySearch => {
    if (typeof search.file === "string" && search.file) return { file: search.file };
    return {};
  },
  component: ConspiracyPage,
});

function ConspiracyPage() {
  const { file } = Route.useSearch();
  return (
    <FileDesk
      section="CONSPIRACY"
      title="Case files"
      intro="Secrecy programs, named committees, and the paper that survived them. Open a file for the record, the gaps, and the sources."
      tag="CASE FILE"
      files={CONSPIRACY_FILES}
      deskPath="/conspiracy"
      seedId={file}
      scratch
    />
  );
}
