import type { ChangeEvent } from "react"

type NoteItemProps = {
  value?: string
  isNew?: boolean
  placeholder?: string
  onValueChange?: (value: string) => void
  onClick?: () => void
}

export function NoteItem({
  value = "",
  isNew = false,
  placeholder,
  onValueChange,
  onClick,
}: NoteItemProps) {
  if (isNew) {
    return (
      <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-dashed border-[#948F99] px-4 text-[#948F99]">
        <input
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onValueChange?.(e.target.value)
          }
          placeholder={placeholder}
          className="w-32 bg-transparent text-sm text-white placeholder-[#948F99] focus:outline-none"
        />
        <button
          type="button"
          onClick={onClick}
          className="text-[#FF859B]"
          aria-label="Adicionar marcador"
        >
          +
        </button>
      </div>
    )
  }

  return (
    <div className="inline-flex h-10 items-center gap-3 rounded-lg bg-[#312E38] px-3">
      <span className="text-xs font-normal text-[#E5E5E5]">{value}</span>
      <button
        type="button"
        onClick={onClick}
        className="text-[#FF859B]"
        aria-label="Remover marcador"
      >
        x
      </button>
    </div>
  )
}

