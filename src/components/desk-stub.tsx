type DeskStubProps = {
  kicker: string;
  title: string;
  body: string;
};

export function DeskStub({ kicker, title, body }: DeskStubProps) {
  return (
    <section className="mx-auto flex max-w-lg flex-col gap-3 px-5 pt-4">
      <p className="font-display text-xs font-medium tracking-kicker text-muted">{kicker}</p>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-fg">{title}</h1>
      <p className="max-w-prose text-sm leading-normal text-muted">{body}</p>
    </section>
  );
}
