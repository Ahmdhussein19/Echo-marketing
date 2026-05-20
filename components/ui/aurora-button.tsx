"use client"

import * as React from "react";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

export function PrimaryButton({
  className,
  children,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap px-8 py-3",
        "text-[14px] font-semibold",
        "text-[#0A0A0A]",
        "bg-[var(--echo-orange)]",
        "rounded-[5px]",
        "transition-colors duration-[var(--duration-fast)]",
        "hover:bg-[var(--echo-orange-hover)]",
        "focus:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-[var(--echo-orange)]",
        "focus-visible:ring-offset-2",
        "focus-visible:ring-offset-[var(--echo-bg)]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
