export const TABS = [
  { id: "archive", href: "/archive", label: "Archive" },
  { id: "conspiracy", href: "/conspiracy", label: "Conspiracy" },
  { id: "ancient", href: "/ancient", label: "Ancient" },
  { id: "x-files", href: "/x-files", label: "X-Files" },
  { id: "the-pole", href: "/the-pole", label: "The Pole" },
  { id: "support", href: "/support", label: "Support" },
] as const;

export type TabHref = (typeof TABS)[number]["href"];

export const TONIGHT_HREF = "/archive" as const;
export const ENTER_HREF = "/archive" as const;

export const LANDING_TAB_ROWS = [
  [
    { href: "/archive", label: "Archive" },
    { href: "/conspiracy", label: "Conspiracy" },
    { href: "/ancient", label: "Ancient" },
  ],
  [
    { href: "/x-files", label: "X-Files" },
    { href: "/the-pole", label: "The Pole" },
  ],
] as const;

export const PRIMARY_NAV = [
  { href: "/archive", label: "Archive", icon: "globe" as const },
  { href: "/conspiracy", label: "Conspiracy", icon: "eye" as const },
  { href: "/ancient", label: "Ancient", icon: "landmark" as const },
  { href: "/x-files", label: "X-Files", icon: "radio" as const },
] as const;

export const MORE_LINKS = [
  {
    href: "/the-pole",
    label: "The Pole",
    blurb: "Live guest channel",
    icon: "message" as const,
  },
  {
    href: "/support",
    label: "Support",
    blurb: "Tips only — no subscription",
    icon: "heart" as const,
  },
  {
    href: "/articles",
    label: "Articles",
    blurb: "Long-form desk notes",
    icon: "file" as const,
  },
] as const;

export const DESK_HEADER: Record<string, { name: string }> = {
  "/archive": { name: "Archive" },
  "/conspiracy": { name: "Conspiracy" },
  "/ancient": { name: "Ancient" },
  "/x-files": { name: "X-Files" },
  "/the-pole": { name: "The Pole" },
  "/support": { name: "Support" },
  "/articles": { name: "Articles" },
};
