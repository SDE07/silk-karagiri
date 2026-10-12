import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium font-ui transition-all duration-200 outline-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden-orange disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-dark-teal text-vanilla-custard-900 hover:bg-ink-black shadow-md",
        primary:
          "bg-dark-teal text-vanilla-custard-900 hover:bg-ink-black shadow-md",
        festive:
          "bg-burnt-caramel text-white hover:bg-rusty-spice shadow-md",
        royal:
          "bg-brown-red text-vanilla-custard-900 hover:bg-oxidized-iron shadow-md",
        destructive:
          "bg-brown-red text-vanilla-custard-900 hover:bg-oxidized-iron shadow-md",
        outline:
          "border border-golden-orange/40 bg-transparent text-ink-black hover:bg-vanilla-custard-800 hover:border-golden-orange",
        secondary:
          "bg-vanilla-custard-800 text-ink-black hover:bg-vanilla-custard-700 border border-golden-orange/20",
        ghost:
          "hover:bg-vanilla-custard-800/80 text-ink-black hover:text-dark-teal",
        link:
          "text-dark-teal underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-5 py-2 text-xs uppercase tracking-wider font-semibold",
        xs: "h-7 px-3 text-[10px] uppercase tracking-wider font-semibold",
        sm: "h-8 px-4 text-xs uppercase tracking-wider font-semibold",
        md: "h-10 px-6 text-xs uppercase tracking-wider font-semibold",
        lg: "h-12 px-8 text-sm uppercase tracking-wider font-semibold",
        icon: "h-9 w-9 p-0 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
