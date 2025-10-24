import { useEffect, useState } from "react"
import { FiArrowLeft } from "react-icons/fi"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { NoteItem } from "../components/NoteItem"
import { useUser } from "../contexts/UserContext"
import { getMovieById, updateMovie } from "../services/movies"

export function EditMovie() {
  const { movieId } = useParams<{ movieId: string }>()
  const navigate = useNavigate()
  const { user } = useUser()

  const [title, setTitle] = useState("")
  const [year, setYear] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!movieId) {
      setError("Filme nao encontrado")
      setLoading(false)
      return
    }

    const ctrl = new AbortController()
    setLoading(true)
    setError(null)
    getMovieById(movieId, ctrl.signal)
      .then((movie) => {
        setTitle(movie.title)
        setYear(movie.year ? String(movie.year) : "")
        setDescription(movie.description)
        setTags(movie.tags)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Nao foi possivel carregar o filme")
      })
      .finally(() => setLoading(false))

    return () => ctrl.abort()
  }, [movieId])

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
    if (!movieId) {
      setError("Filme nao encontrado")
      return
    }
    setSaving(true)
    setError(null)
    try {
      await updateMovie(movieId, {
        title,
        description,
        tags,
        year: year ? Number(year) : undefined,
      })
      navigate(`/detalhes/${movieId}`, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel salvar as alteracoes")
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return <Navigate to="/siginin" replace />
  }

  if (loading) {
    return (
      <div className="px-32 py-10">
        <p className="text-base text-[#999591]">Carregando informacoes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-32 py-10">
        <p className="text-base text-red-400">{error}</p>
        <Link className="mt-4 inline-flex items-center gap-2 text-[#FF859B] no-underline" to="/">
          <FiArrowLeft />
          Voltar
        </Link>
      </div>
    )
  }

  return (
    <div className="px-32 py-10">
      <Link
        className="inline-flex items-center gap-2 text-[#FF859B] no-underline"
        to={`/detalhes/${movieId}`}
      >
        <FiArrowLeft />
        Voltar
      </Link>

      <h1 className="mt-6 font-secondary text-4xl font-bold text-white">Editar filme</h1>

      <form className="mt-10" onSubmit={(e) => e.preventDefault()}>
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

        <h2 className="mt-10 font-secondary text-xl font-normal text-[#E5E5E5]">Marcadores</h2>
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

      <div className="mt-8 flex justify-end">
        <button
          className="h-12 rounded-lg bg-[#FF859B] px-8 font-medium text-[#3E3B47] disabled:opacity-60"
          onClick={handleSave}
          type="button"
          disabled={saving}
        >
          {saving ? "Salvando..." : "Salvar alteracoes"}
        </button>
      </div>
    </div>
  )
}

