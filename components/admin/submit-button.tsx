"use client";

import { useFormStatus } from "react-dom";

import { cn } from "@/lib/cn";

/**
 * Submit button that disables itself while its form is in flight. Lives in its
 * own component because `useFormStatus` reads the status of the nearest parent
 * form — it returns nothing if called from the component that renders it.
 */
export function SubmitButton({
  children,
  pendingLabel,
  variant = "primary",
  className,
  ...props
}: React.ComponentProps<"button"> & {
  pendingLabel?: string;
  variant?: "primary" | "ghost" | "danger";
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || props.disabled}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-lg px-5 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-forest-800 text-sand-50 hover:bg-forest-700",
        variant === "ghost" &&
          "border border-forest-900/15 text-forest-800 hover:bg-forest-800/5",
        variant === "danger" && "border border-red-300 text-red-700 hover:bg-red-50",
        className,
      )}
      {...props}
    >
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}
