import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../utils/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section" | "article";
  padded?: boolean;
  interactive?: boolean;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, as: Tag = "div", padded = true, interactive = false, ...props }, ref) => {
    return (
      <Tag
        ref={ref}
        className={cn(
          "border-line bg-surface rounded-2xl border",
          padded && "p-5",
          interactive &&
            "hover:border-line-strong hover:bg-elev cursor-pointer transition-colors",
          className,
        )}
        {...props}
      />
    );
  },
);

Card.displayName = "Card";

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-between gap-3", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-ink text-sm font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

export function CardKicker({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-ink-3 font-mono text-[10px] tracking-[0.16em] uppercase",
        className,
      )}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-ink-2 mt-3 text-sm", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border-line-2 mt-4 flex items-center justify-between gap-3 border-t pt-3",
        className,
      )}
      {...props}
    />
  );
}
