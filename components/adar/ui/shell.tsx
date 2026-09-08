import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  className?: string;
  size?: "narrow" | "default" | "wide";
  as?: "div" | "section" | "header" | "footer" | "nav" | "ul";
};

const sizes = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-[1500px]",
} as const;

/** Общая горизонтальная сетка витрины ADAR. */
export function Shell({ children, className, size = "default", as: Tag = "div" }: Props) {
  return (
    <Tag className={cn("mx-auto w-full px-5 sm:px-8 lg:px-10", sizes[size], className)}>
      {children}
    </Tag>
  );
}
