/** biome-ignore-all lint/style/useFilenamingConvention: ok */
import { useState } from "react"
import { FiArrowLeft } from "react-icons/fi"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { NoteItem } from "../components/NoteItem"
import { useUser } from "../contexts/UserContext"
import { createMovie, generateMovieDescription } from "../services/movies"

export function CreateMovie() {
  const { user, hasRole } = useUser()
  const isAdmin = hasRole("Admin")
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [year, setYear] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [saving, setSaving] = useState(false)
  const [generatingDescription, setGeneratingDescription] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  function addTag() {
    const value = newTag.trim()
    if (!value || tags.includes(value)) {
      setNewTag("")
      return
    }
    setTags((prev) => [...prev, value])
    setNewTag("")
  }

  function removeTag(value: string) {
    setTags((prev) => prev.filter((tag) => tag !== value))
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const movie = await createMovie({
        title,
        description,
        tags,
        year: year ? Number(year) : undefined,
      })
      navigate(`/detalhes/${movie.id}`, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel criar o filme")
    } finally {
      setSaving(false)
    }
  }

  function handleReset() {
    setTitle("")
    setYear("")
    setDescription("")
    setTags([])
    setNewTag("")
    setError(null)
  }

  async function handleGenerateDescription() {
    if (!title.trim()) {
      setError("Informe um titulo para gerar a descricao automaticamente")
      return
    }

    setGeneratingDescription(true)
    setError(null)
    try {
      const generatedDescription = await generateMovieDescription(title.trim())
      if (!generatedDescription) {
        setError("Nao foi possivel gerar a descricao automaticamente")
        return
      }
      setDescription(generatedDescription)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Nao foi possivel gerar a descricao automaticamente",
      )
    } finally {
      setGeneratingDescription(false)
    }
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

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-secondary text-4xl font-bold text-white">Novo filme</h1>
        <button
          className="h-12 w-full rounded-lg border border-[#FF859B] px-6 text-sm font-medium text-[#FF859B] transition hover:bg-[#FF859B]/10 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          onClick={handleGenerateDescription}
          type="button"
          disabled={generatingDescription || saving || !title.trim()}
        >
          {generatingDescription ? "Gerando descricao..." : "Gerar descricao com IA"}
        </button>
      </div>

      <form className="mt-10" onSubmit={(event) => event.preventDefault()}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <input
            className="h-14 w-full rounded-[10px] border-0 bg-[#262529] px-6 py-4 text-white placeholder:text-[#948F99] focus:outline-none"
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Titulo"
            type="text"
            value={title}
          />
          <input
            className="h-14 w-full rounded-[10px] border-0 bg-[#262529] px-6 py-4 text-white placeholder:text-[#948F99] focus:outline-none"
            max={2100}
            min={1900}
            onChange={(event) => setYear(event.target.value)}
            onInput={(event) => {
              const el = event.currentTarget
              el.value = el.value.replace(/\D/g, "").slice(0, 4)
            }}
            placeholder="Ano de lancamento"
            step={1}
            type="number"
            value={year}
          />
        </div>

        <div className="mt-6">
          <textarea
            className="h-64 w-full resize-none rounded-[10px] border-0 bg-[#262529] px-6 py-4 text-white placeholder:text-[#948F99] focus:outline-none"
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Observacoes"
            value={description}
          />
        </div>

        <h2 className="mt-10 font-secondary text-xl font-normal text-[#E5E5E5]">
          Marcadores
        </h2>
        <div className="mt-4 rounded-xl bg-[#0D0C0F] p-6">
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <NoteItem key={tag} onClick={() => removeTag(tag)} value={tag} />
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

      {error ? <p className="mt-6 text-sm text-red-400">{error}</p> : null}

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <button
          className="h-12 cursor-pointer rounded-lg bg-[#0D0C0F] text-[#FF859B]"
          onClick={handleReset}
          type="button"
        >
          Limpar campos
        </button>

        <button
          className="h-12 cursor-pointer rounded-lg bg-[#FF859B] font-medium text-[#3E3B47] disabled:opacity-60"
          onClick={handleSave}
          type="button"
          disabled={saving}
        >
          {saving ? "Salvando..." : "Salvar filme"}
        </button>
      </div>
    </div>
  )
}

