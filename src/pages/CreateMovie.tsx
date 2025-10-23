import { useState } from "react"
import { FiArrowLeft } from "react-icons/fi"
import { Link } from "react-router-dom"
import { NoteItem } from "../components/NoteItem"

export function CreateMovie() {
  const [tags, setTags] = useState<string[]>(["React"])
  const [newTag, setNewTag] = useState("")

  function addTag() {
    const v = newTag.trim()
    if (!v) { return }
    if (tags.includes(v)) {
      setNewTag("")
      return
    }
    setTags((prev) => [...prev, v])
    setNewTag("")
  }

  function removeTag(value: string) {
    setTags((prev) => prev.filter((t) => t !== value))
  }

  return (
    <div className="px-32 py-10">
      <Link
        className="inline-flex items-center gap-2 text-[#FF859B] no-underline"
        to="/"
      >
        <FiArrowLeft />
        Voltar
      </Link>

      <h1 className="mt-6 font-bold font-secondary text-4xl text-white">
        Novo filme
      </h1>

      <form className="mt-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <input
            className="h-14 w-full rounded-[10px] border-0 bg-[#262529] px-6 py-4 text-white placeholder:text-[#948F99] focus:outline-none"
            placeholder="Título"
            type="text"
          />
          <input
            className="h-14 w-full rounded-[10px] border-0 bg-[#262529] px-6 py-4 text-white placeholder:text-[#948F99] focus:outline-none"
            max={2100}
            min={1900}
            onInput={(e) => {
              const el = e.currentTarget
              // biome-ignore lint/style/noMagicNumbers: Não se preocupe
              el.value = el.value.replace(/\D/g, "").slice(0, 4)
            }}
            placeholder="Ano de lançamento"
            step={1}
            type="number"
          />
        </div>

        <div className="mt-6">
          <textarea
            className="h-64 w-full resize-none rounded-[10px] border-0 bg-[#262529] px-6 py-4 text-white placeholder:text-[#948F99] focus:outline-none"
            placeholder="Observações"
          />
        </div>

        <h2 className="mt-10 font-normal font-secondary text-[#E5E5E5] text-xl">
          Marcadores
        </h2>
        <div className="mt-4 rounded-xl bg-[#0D0C0F] p-6">
          <div className="flex flex-wrap gap-3">
            {tags.map((t) => (
              <NoteItem key={t} onClick={() => removeTag(t)} value={t} />
            ))}
            <NoteItem
              isNew
              onClick={addTag}
              onValueChange={setNewTag}
              placeholder="Novo marcador"
              value={newTag}
            />
          </div>
        </div>
      </form>
    </div>
  )
}
