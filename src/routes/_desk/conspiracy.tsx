import { createFileRoute } from "@tanstack/react-router";
import { FileDesk } from "@/components/file-desk";
import { CONSPIRACY_FILES } from "@/lib/conspiracy-files";

export const Route = createFileRoute("/_desk/conspiracy")({
  component: ConspiracyPage,
});

function ConspiracyPage() {
  return (
    <FileDesk
      section="CONSPIRACY"
      title="Case files"
      intro="Secrecy programs, named committees, and the paper that survived them. Open a file for the record, the gaps, and the sources."
      tag="CASE FILE"
      files={CONSPIRACY_FILES}
    />
  );
}
