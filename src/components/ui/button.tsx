import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "rounded-lg bg-brand-900 text-white hover:bg-brand-700 hover:scale-[1.02]",
        primary:
          "rounded-full bg-accent-red text-white hover:bg-accent-red-hover hover:scale-[1.02]",
        secondary:
          "rounded-full bg-brand-700 text-white hover:bg-brand-500 hover:scale-[1.02]",
        "outline-light":
          "rounded-full border border-white/60 bg-transparent text-white hover:bg-white hover:text-brand-900",
        outline:
          "rounded-lg border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-cream",
        ghost:
          "rounded-lg text-brand-700 hover:bg-brand-50 hover:underline group",
        link: "rounded-none text-brand-700 font-semibold underline-offset-4 hover:underline",
        destructive:
          "rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20",
      },
      size: {
        default: "h-10 gap-2 px-5",
        xs: "h-7 gap-1 rounded-lg px-2.5 text-xs",
        sm: "h-9 gap-1.5 px-4 text-sm",
        lg: "h-12 gap-2 px-8 text-base",
        xl: "h-14 gap-2.5 px-10 text-base",
        icon: "size-10 rounded-lg",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-12 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
