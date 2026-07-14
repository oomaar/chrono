import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "focus-visible:ring-brand/40 focus-visible:ring-offset-bg relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-[opacity,background-color,border-color,color,transform] duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45 disabled:active:scale-100",
  {
    variants: {
      variant: {
        primary: "bg-brand text-bg hover:opacity-90",
        secondary:
          "border-line bg-surface text-ink hover:border-line-strong hover:bg-elev border",
        ghost: "text-ink-2 hover:bg-elev hover:text-ink",
        danger: "bg-crit text-bg hover:opacity-90",
        outline: "border-line-strong text-ink hover:bg-surface border bg-transparent",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4 text-sm",
        lg: "h-11 px-6 text-sm",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
