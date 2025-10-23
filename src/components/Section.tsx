/** biome-ignore-all lint/a11y/useValidAnchor: Don't mind */
import type React from "react"

type SectionProps = {
  children: React.ReactNode
}

export function Section({ children }: SectionProps) {
  return(
    <a href="#" className="flex w-[80%] p-8 flex-col mr-5 items-start gap-4 rounded-2xl bg-[#FF859B10]">
      <h2 className="text-white font-secondary font-bold text-2xl"> Interestellar</h2>

      {children}
    </a>
  )
}