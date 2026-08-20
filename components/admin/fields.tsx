import { cn } from "@/lib/cn";

const controlClass =
  "w-full rounded-lg border border-forest-900/20 bg-white px-3.5 text-sm text-forest-950 transition-colors focus:border-forest-700";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-sm font-medium text-forest-900">{label}</span>
      {hint ? <span className="mt-0.5 block text-xs text-ink-subtle">{hint}</span> : null}
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

export function TextInput(props: React.ComponentProps<"input">) {
  return <input {...props} className={cn(controlClass, "h-11", props.className)} />;
}

export function TextArea(props: React.ComponentProps<"textarea">) {
  return (
    <textarea
      rows={4}
      {...props}
      className={cn(controlClass, "py-2.5 leading-relaxed", props.className)}
    />
  );
}

export function Select(props: React.ComponentProps<"select">) {
  return <select {...props} className={cn(controlClass, "h-11", props.className)} />;
}

export function Checkbox({
  label,
  hint,
  ...props
}: React.ComponentProps<"input"> & { label: string; hint?: string }) {
  return (
    <label className="flex items-start gap-3">
      <input
        type="checkbox"
        {...props}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-forest-900/30 accent-forest-800"
      />
      <span>
        <span className="block text-sm font-medium text-forest-900">{label}</span>
        {hint ? <span className="mt-0.5 block text-xs text-ink-subtle">{hint}</span> : null}
      </span>
    </label>
  );
}

export function Fieldset({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-forest-900/10 bg-white p-5 lg:p-6">
      <legend className="px-1 text-sm font-semibold text-forest-950">{title}</legend>
      {description ? (
        <p className="mt-1 text-xs text-ink-subtle">{description}</p>
      ) : null}
      <div className="mt-4 space-y-4">{children}</div>
    </fieldset>
  );
}
