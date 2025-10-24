type TagProps = { label: string }

export function Tag({ label }: TagProps) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-[#312E38] px-1.5 py-2">
      <p className="text-center font-normal font-primary text-[#E5E5E5] text-xs">{label}</p>
    </div>
  )
}

