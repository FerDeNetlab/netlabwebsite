"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CollapsibleSEOContentProps {
  title: string
  content: string
  defaultOpen?: boolean
}

export function CollapsibleSEOContent({ title, content, defaultOpen = false }: CollapsibleSEOContentProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-slate-800 rounded-lg bg-[#111] overflow-hidden">
      <Button
        variant="ghost"
        className="w-full justify-between p-4 hover:bg-slate-900/50 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-slate-200 font-semibold">{title}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
      </Button>

      {isOpen && (
        <div className="p-4 border-t border-slate-800 text-slate-400 whitespace-pre-line leading-relaxed">
          {content}
        </div>
      )}
    </div>
  )
}
