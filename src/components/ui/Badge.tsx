import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive'
  className?: string;
  children?: React.ReactNode;
  key?: React.Key;
  onClick?: any;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded border px-2 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-sky-50 text-sky-600 hover:bg-sky-100": variant === "default",
          "border-transparent bg-slate-100 text-slate-800 hover:bg-slate-200": variant === "secondary",
          "border-transparent bg-emerald-50 text-emerald-600": variant === "success",
          "border-transparent bg-amber-500 text-white": variant === "warning",
          "text-slate-950 border-slate-200": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
