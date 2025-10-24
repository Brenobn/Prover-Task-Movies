/** biome-ignore-all lint/style/useFilenamingConvention: ok */
/** biome-ignore-all lint/suspicious/noEmptyBlockStatements: ok */
/** biome-ignore-all lint/suspicious/noConsole: ok */
import { useEffect, useState } from "react"
import { FiArrowLeft } from "react-icons/fi"
import { Link } from "react-router-dom"
import { NoteItem } from "../components/NoteItem"

type MovieDraft = {
  title: string
  year: number | undefined
  description: string
  tags: string[]
}

export function CreateMovie() {
  const [title, setTitle] = useState("")
  const [year, setYear] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState<string[]>(["React"])
  const [newTag, setNewTag] = useState("")
  const [showConfirm, setShowConfirm] = useState(false)

  const STORAGE_DRAFT = "prover-movies:draft-create"

  function addTag() {
    const v = newTag.trim()
    if (!v) {
      return
    }
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

  function handleSave() {
    const payload: MovieDraft = {
      title,
      year: year ? Number(year) : undefined,
      description,
      tags,
    }
    try {
      localStorage.setItem(STORAGE_DRAFT, JSON.stringify(payload))
    } catch {}
    console.log("Salvar alterações clicado", payload)
    // TODO .NET: POST/PUT para API de filmes com `payload`
  }

  function handleDelete() {
    console.log("Excluir filme clicado")
    // TODO .NET: DELETE na API de filmes quando houver ID
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_DRAFT)
      if (raw) {
        const d = JSON.parse(raw) as MovieDraft
        setTitle(d.title ?? "")
        setYear(d.year ? String(d.year) : "")
        setDescription(d.description ?? "")
        if (Array.isArray(d.tags)) {
          setTags(d.tags)
        }
      }
    } catch {}
  }, [])

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

      <form className="mt-10" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <input
            className="h-14 w-full rounded-[10px] border-0 bg-[#262529] px-6 py-4 text-white placeholder:text-[#948F99] focus:outline-none"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
            type="text"
            value={title}
          />
          <input
            className="h-14 w-full rounded-[10px] border-0 bg-[#262529] px-6 py-4 text-white placeholder:text-[#948F99] focus:outline-none"
            max={2100}
            min={1900}
            onChange={(e) => setYear(e.target.value)}
            onInput={(e) => {
              const el = e.currentTarget
              // biome-ignore lint/style/noMagicNumbers: ok
              el.value = el.value.replace(/\D/g, "").slice(0, 4)
            }}
            placeholder="Ano de lançamento"
            step={1}
            type="number"
            value={year}
          />
        </div>

        <div className="mt-6">
          <textarea
            className="h-64 w-full resize-none rounded-[10px] border-0 bg-[#262529] px-6 py-4 text-white placeholder:text-[#948F99] focus:outline-none"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Observações"
            value={description}
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

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <button
          className="h-12 cursor-pointer rounded-lg bg-[#0D0C0F] text-[#FF859B]"
          onClick={() => setShowConfirm(true)}
          type="button"
        >
          Excluir filme
        </button>

        <button
          className="h-12 cursor-pointer rounded-lg bg-[#FF859B] font-medium text-[#3E3B47]"
          onClick={handleSave}
          type="button"
        >
          Salvar alterações
        </button>
      </div>

      {showConfirm && (
        <div
          aria-modal
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          role="dialog"
        >
          <div className="w-[420px] rounded-xl bg-[#1C1B1E] p-6 text-white shadow-lg">
            <h3 className="font-bold font-secondary text-xl">Excluir filme</h3>
            <p className="mt-2 text-[#C4C4CC] text-sm">
              Tem certeza que deseja excluir este filme?
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                className={"h-11 cursor-pointer rounded-lg bg-[#0D0C0F] text-[#FF859B]"}
                onClick={() => setShowConfirm(false)}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="h-11 cursor-pointer rounded-lg bg-[#FF859B] font-medium text-[#3E3B47]"
                onClick={() => {
                  setTitle("")
                  setYear("")
                  setDescription("")
                  setTags([])
                  setNewTag("")
                  try {
                    localStorage.removeItem(STORAGE_DRAFT)
                  } catch {}
                  setShowConfirm(false)
                  handleDelete()
                }}
                type="button"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

