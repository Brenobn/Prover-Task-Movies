import type { IconType } from "react-icons"
import { Link } from "react-router-dom"

type ButtonTextProps = {
  icon?: IconType
  title: string
  to?: string
}

export function ButtonText({ icon: Icon, title, to = "/" }: ButtonTextProps) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 border-0 bg-none text-base text-[#FF859B] [&_svg]:text-[#FF859B]"
    >
      {Icon ? <Icon size={20} /> : null}
      {title}
    </Link>
  )
}
