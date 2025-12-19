import { H1, P } from "@repo/ui/core/typography";

export default function Header({
  title,
  subtitle,
  Icon,
}: {
  title: string;
  subtitle?: string;
  Icon?: React.ComponentType<{ className?: string }>;
}) {
  if (typeof window === "undefined" || !title) return null;
  return (
    <header>
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex items-center gap-3">
          <Icon className="h-7 w-7 text-zinc-400" />
          <H1 className="text-2xl font-semibold tracking-tight">{title}</H1>
        </div>

        {subtitle && <P className="mt-1 text-sm text-zinc-400">{subtitle}</P>}
      </div>
    </header>
  );
}
