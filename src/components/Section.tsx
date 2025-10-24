/** biome-ignore-all lint/a11y/useValidAnchor: Don't mind */
import type React from "react"
import { Link } from "react-router-dom"

type SectionProps = {
  title: string
  to: string
  children: React.ReactNode
}

export function Section({ title, to, children }: SectionProps) {
  return (
    <Link
      to={to}
      className="flex w-full flex-col items-start gap-4 rounded-2xl bg-[#FF859B10] p-8 no-underline"
    >
      <h2 className="font-bold font-secondary text-2xl text-white">{title}</h2>

      {children}
    </Link>
  )
}
