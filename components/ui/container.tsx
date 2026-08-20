import { cn } from "@/lib/cn";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  /** `wide` is used by full-bleed media sections, `narrow` by article bodies. */
  size?: "narrow" | "default" | "wide";
  as?: "div" | "section" | "header" | "footer" | "article" | "nav";
};

const sizes = {
  narrow: "max-w-3xl",
  default: "max-w-7xl",
  wide: "max-w-[1600px]",
} as const;

export function Container({
  children,
  className,
  size = "default",
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full px-5 sm:px-8 lg:px-12", sizes[size], className)}>
      {children}
    </Tag>
  );
}
