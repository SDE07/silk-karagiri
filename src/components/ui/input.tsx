import * as React from "react"

import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border-0 bg-vanilla-custard-800/80 px-3.5 py-1.5 font-ui text-xs text-ink-black placeholder:text-ink-black-300/50 shadow-2xs transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-dark-teal/50 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
