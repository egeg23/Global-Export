import Link from "next/link";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-xl font-medium text-forest-950">{title}</h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm text-ink-muted">{description}</p>
        ) : null}
      </div>

      {action ? (
        <Link
          href={action.href}
          className="inline-flex h-10 shrink-0 items-center rounded-lg bg-forest-800 px-5 text-sm font-medium text-sand-50 transition-colors hover:bg-forest-700"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
