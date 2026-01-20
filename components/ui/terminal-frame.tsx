import type React from "react"
import { cn } from "@/lib/utils"

interface TerminalFrameProps {
  children: React.ReactNode
  title?: string
  className?: string
  borderColor?: "green" | "purple" | "gray"
}

export function TerminalFrame({
  children,
  title = "netlab@consulting:~",
  className,
  borderColor = "gray",
}: TerminalFrameProps) {
  const borderColors = {
    green: "border-green-500/30",
    purple: "border-purple-500/30",
    gray: "border-slate-800",
  }

  return (
    <div
      className={cn(
        "w-full rounded-lg border bg-[#0a0a0a] overflow-hidden shadow-2xl font-mono",
        borderColors[borderColor],
        className,
      )}
    >
      {/* Terminal Header */}
      <div className="flex items-center px-4 py-2 bg-[#1a1b26] border-b border-slate-800">
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="text-xs text-slate-400 select-none flex-1 text-center font-medium opacity-70 truncate">
          {title}
        </div>
        <div className="w-12" /> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="p-6 relative">{children}</div>
    </div>
  )
}
