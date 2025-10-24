import type { InputHTMLAttributes } from "react"
import type { IconType } from "react-icons"

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: IconType
}

export function Input({ icon: Icon, placeholder, ...rest }: InputProps) {
  return (
    <div className="flex w-full items-center rounded-[10px] bg-[#262529] text-[#948F99]">
      {Icon ? (
        <span className="ml-6 text-[#948F99]">
          <Icon size={20} />
        </span>
      ) : null}
      <input
        className="h-14 w-full border-0 bg-transparent px-6 py-5 text-white placeholder:text-[#948F99] focus:outline-none"
        placeholder={placeholder ?? "Pesquisar pelo titulo"}
        {...rest}
      />
    </div>
  )
}
