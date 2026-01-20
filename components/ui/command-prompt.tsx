import type React from "react"
interface CommandPromptProps {
  command: string
  output?: React.ReactNode
  path?: string
  user?: string
}

export function CommandPrompt({ command, output, path = "~", user = "user@netlab" }: CommandPromptProps) {
  return (
    <div className="mb-6 font-mono text-sm md:text-base">
      <div className="flex flex-wrap items-center gap-2 mb-2 break-all">
        <span className="text-green-500 font-bold">{user}:</span>
        <span className="text-blue-500 font-bold">{path}$</span>
        <span className="text-slate-100">{command}</span>
      </div>
      {output && <div className="pl-0 md:pl-4 text-slate-300 mt-2">{output}</div>}
    </div>
  )
}
