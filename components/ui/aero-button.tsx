"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AeroButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export const AeroButton = React.forwardRef<HTMLButtonElement, AeroButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group not-disabled:inset-shadow-none mx-auto flex cursor-pointer items-center justify-center gap-0 rounded-full border-none bg-transparent px-0 py-5 font-normal shadow-none hover:bg-transparent",
          className
        )}
        {...props}
      >
        <span className="rounded-full bg-[var(--echo-orange)] px-6 py-3 text-[#0A0A0A] duration-500 ease-in-out group-hover:bg-white group-hover:text-[#0A0A0A] group-hover:transition-colors">
          {children}
        </span>
        <div className="relative flex h-fit cursor-pointer items-center overflow-hidden rounded-full bg-[var(--echo-orange)] p-5 text-[#0A0A0A] duration-500 ease-in-out group-hover:bg-white group-hover:text-[#0A0A0A] group-hover:transition-colors">
          <ArrowRight className="absolute h-5 w-5 -translate-x-1/2 transition-all duration-500 ease-in-out group-hover:translate-x-10" />
          <ArrowRight className="absolute h-5 w-5 -translate-x-10 transition-all duration-500 ease-in-out group-hover:-translate-x-1/2" />
        </div>
      </button>
    )
  }
)

AeroButton.displayName = "AeroButton"
