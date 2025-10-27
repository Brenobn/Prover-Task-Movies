import type { IconType } from "react-icons"
import { Link } from "react-router-dom"

type ButtonTextProps = {
  icon?: IconType
  title: string
  to?: string
  className?: string
}

export function ButtonText({ icon: Icon, title, to = "/", className }: ButtonTextProps) {
  return (
    <Link
      to={to}
      className={className}
    >
      {Icon ? <Icon size={20} /> : null}
      {title}
    </Link>
  )
}
