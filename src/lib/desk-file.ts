export type DeskFile = {
  id: string;
  title: string;
  kicker: string;
  subtitle: string;
  lede: string;
  summary: string;
  body: string;
  evidence: string;
  sources: string[];
  image?: {
    src: string;
    alt: string;
    credit: string;
  };
};

export function speechForFile(file: DeskFile) {
  return [file.title, file.subtitle, file.summary, file.body, file.evidence]
    .map((part) => part.trim())
    .filter(Boolean)
    .join("\n\n");
}
