import { useEffect, useState } from "react"
import { GoArrowLeft } from "react-icons/go"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ButtonText } from "../components/ButtonText"
import { StarRating } from "../components/StarRating"
import { Tag } from "../components/Tag"
import { useUser } from "../contexts/UserContext"
import { deleteMovie, getMovieById, updateMovie, type Movie } from "../services/movies"

export function Details() {
  const { movieId } = useParams<{ movieId: string }>()
  const navigate = useNavigate()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userRating, setUserRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const { hasRole } = useUser()
  const isAdmin = hasRole("Admin")

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
      .then((data) => {
        setMovie(data)
        setUserRating(0)
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") {
          return
        }
        setError(err instanceof Error ? err.message : "Erro ao carregar filme")
      })
      .finally(() => setLoading(false))

    return () => ctrl.abort()
  }, [movieId])

  async function handleSubmitRating() {
    if (!movieId || !movie) {
      setSubmitError("Filme nao encontrado")
      return
    }
    if (userRating < 1 || userRating > 5) {
      setSubmitError("Selecione uma nota de 1 a 5")
      return
    }

    setSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(null)
    try {
      const updated = await updateMovie(movieId, {
        title: movie.title,
        description: movie.description,
        tags: movie.tags,
        year: movie.year,
        rating: userRating,
      })
      setMovie(updated)
      setSubmitSuccess("Avaliacao enviada!")
      setUserRating(0)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Nao foi possivel registrar sua avaliacao")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteMovie() {
    if (!movieId) {
      setDeleteError("Filme nao encontrado")
      return
    }

    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteMovie(movieId)
      setShowDeleteConfirm(false)
      navigate("/", { replace: true })
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Nao foi possivel excluir o filme",
      )
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto my-10 flex max-w-6xl flex-col gap-10">
      <div className="flex items-center gap-2">
        <ButtonText title="Voltar" icon={GoArrowLeft} to="/" />
      </div>

      {loading && <p className="font-primary text-base text-[#999591]">Carregando filme...</p>}
      {error && <p className="font-primary text-base text-red-400">{error}</p>}

      {!loading && !error && movie && (
        <>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="inline-flex flex-col gap-3">
              <div className="inline-flex flex-row items-center gap-4">
                <h1 className="font-secondary text-4xl font-medium text-white">
                  {movie.title}
                </h1>
                <div className="flex items-center gap-2">
                  <StarRating value={movie.rating} size={24} />
                  <span className="text-sm font-medium text-[#FF859B]">
                    {movie.rating.toFixed(1)}
                  </span>
                </div>
              </div>
              {movie.year ? (
                <span className="text-sm text-[#999591]">Lancamento: {movie.year}</span>
              ) : null}
            </div>

            {isAdmin && (
              <div className="flex flex-wrap gap-3">
                <Link
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-[#FF859B] px-6 font-medium text-[#3E3B47] no-underline"
                  to={`/editarfilme/${movie.id}`}
                >
                  Editar filme
                </Link>
                <button
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-red-500 px-6 font-medium text-white transition hover:bg-red-600"
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Excluir filme
                </button>
              </div>
            )}
          </div>

          {movie.tags.length > 0 && (
            <div className="inline-flex flex-wrap items-start gap-2">
              {movie.tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>
          )}

          <p className="font-secondary text-base font-normal text-white">
            {movie.description}
          </p>

          <div className="rounded-xl bg-[#0D0C0F] p-6">
            <h2 className="font-secondary text-lg font-semibold text-white">
              O que achou do filme?
            </h2>
            <p className="mt-1 text-sm text-[#999591]">
              Escolha uma nota de 1 a 5 estrelas para contribuir com a media do filme.
            </p>
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <StarRating
                value={userRating}
                size={28}
                editable
                allowHalf={false}
                onChange={(value) => setUserRating(value)}
              />
              <button
                className="h-11 rounded-lg bg-[#FF859B] px-6 font-medium text-[#3E3B47] disabled:opacity-60"
                onClick={handleSubmitRating}
                type="button"
                disabled={submitting}
              >
                {submitting ? "Enviando..." : "Enviar avaliacao"}
              </button>
            </div>
            {submitError && <p className="mt-2 text-sm text-red-400">{submitError}</p>}
            {submitSuccess && <p className="mt-2 text-sm text-emerald-400">{submitSuccess}</p>}
          </div>
        </>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-xl bg-[#1C1B1E] p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-white">Excluir filme?</h3>
            <p className="mt-2 text-sm text-[#999591]">
              Voce esta prestes a excluir{" "}
              <span className="font-medium text-white">{movie?.title ?? "este filme"}</span>.
              Essa acao nao pode ser desfeita.
            </p>
            {deleteError && <p className="mt-3 text-sm text-red-400">{deleteError}</p>}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                className="flex-1 rounded-lg border border-[#3E3B47] px-4 py-2 text-white transition hover:bg-[#2A2930]"
                type="button"
                onClick={() => {
                  if (deleting) return
                  setShowDeleteConfirm(false)
                  setDeleteError(null)
                }}
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                className="flex-1 rounded-lg bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
                type="button"
                onClick={handleDeleteMovie}
                disabled={deleting}
              >
                {deleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
