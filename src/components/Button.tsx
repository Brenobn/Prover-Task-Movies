import type { ButtonHTMLAttributes } from "react"
import type { IconType } from "react-icons"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: IconType
  title: string
}

export function Button({ icon: Icon, title, type = "button", ...rest }: ButtonProps) {
  return (
    <button
      className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-[10px] border-0 bg-[#FF859B] px-4 py-0 font-medium text-[#3E3B47]"
      type={type}
      {...rest}
    >
      {Icon ? <Icon size={16} /> : null}
      {title}
    </button>
  )
}
