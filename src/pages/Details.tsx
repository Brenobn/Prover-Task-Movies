import { useCallback, useEffect, useState } from "react"
import { GoArrowLeft } from "react-icons/go"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ButtonText } from "../components/ButtonText"
import { StarRating } from "../components/StarRating"
import { Tag } from "../components/Tag"
import { useUser } from "../contexts/UserContext"
import { deleteMovie, getMovieById, type Movie } from "../services/movies"
import {
  getMovieReviews,
  submitMovieReview,
  type MovieReviewSummary,
} from "../services/reviews"

const reviewDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})

function formatReviewDate(dateValue?: string | null) {
  if (!dateValue) return ""
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return ""
  return reviewDateFormatter.format(date)
}

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
  const [userComment, setUserComment] = useState("")
  const [reviewsSummary, setReviewsSummary] = useState<MovieReviewSummary | null>(null)
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewsError, setReviewsError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const { user, hasRole } = useUser()
  const isAdmin = hasRole("Admin")
  const totalCommunityReviews =
    reviewsSummary?.totalAvaliacoes ?? reviewsSummary?.avaliacoes.length ?? 0

  const loadReviews = useCallback(
    async (abortSignal?: AbortSignal) => {
      if (!movieId) {
        setReviewsSummary(null)
        setReviewsLoading(false)
        setUserRating(0)
        setUserComment("")
        return
      }
      setReviewsLoading(true)
      setReviewsError(null)
      try {
        const data = await getMovieReviews(movieId, abortSignal)
        setReviewsSummary(data)
        setUserRating(data.suaNota ?? 0)
        setUserComment(data.seuComentario ?? "")
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return
        }
        setReviewsError(
          err instanceof Error ? err.message : "Erro ao carregar avaliacoes do filme",
        )
      } finally {
        if (!abortSignal || !abortSignal.aborted) {
          setReviewsLoading(false)
        }
      }
    },
    [movieId],
  )

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

  useEffect(() => {
    const ctrl = new AbortController()
    loadReviews(ctrl.signal)
    return () => ctrl.abort()
  }, [loadReviews, user?.id])

  async function handleSubmitRating() {
    if (!movieId || !movie) {
      setSubmitError("Filme nao encontrado")
      return
    }
    if (!user) {
      setSubmitError("Voce precisa estar autenticado para avaliar")
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
      const comentarioPayload = userComment.trim()
      await submitMovieReview(movieId, {
        nota: userRating,
        comentario: comentarioPayload.length > 0 ? comentarioPayload : undefined,
      })
      const updated = await getMovieById(movieId)
      setMovie(updated)
      await loadReviews()
      setSubmitSuccess("Avaliacao enviada!")
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
            <textarea
              className="mt-4 min-h-[120px] w-full rounded-lg border border-transparent bg-[#262529] p-4 text-sm text-white placeholder:text-[#948F99] focus:border-[#FF859B] focus:outline-none"
              placeholder={
                user
                  ? "Compartilhe um comentario sobre o filme"
                  : "Entre para comentar e avaliar o filme"
              }
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              disabled={!user || submitting}
            />
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <StarRating
                value={userRating}
                size={28}
                editable={Boolean(user) && !submitting}
                allowHalf={false}
                onChange={(value) => setUserRating(value)}
              />
              <button
                className="h-11 rounded-lg bg-[#FF859B] px-6 font-medium text-[#3E3B47] disabled:opacity-60"
                onClick={handleSubmitRating}
                type="button"
                disabled={submitting || !user}
              >
                {submitting ? "Enviando..." : "Enviar avaliacao"}
              </button>
            </div>
            {!user && (
              <p className="mt-2 text-sm text-[#999591]">
                Faca login para registrar sua avaliacao e comentario.
              </p>
            )}
            {submitError && <p className="mt-2 text-sm text-red-400">{submitError}</p>}
            {submitSuccess && <p className="mt-2 text-sm text-emerald-400">{submitSuccess}</p>}
          </div>

          <div className="rounded-xl bg-[#0D0C0F] p-6">
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
              <h2 className="font-secondary text-lg font-semibold text-white">
                Avaliacoes da comunidade
              </h2>
              {reviewsSummary && (
                <span className="text-sm text-[#999591]">
                  {totalCommunityReviews}{" "}
                  {totalCommunityReviews === 1 ? "avaliacao" : "avaliacoes"}
                </span>
              )}
            </div>
            {reviewsLoading && (
              <p className="mt-4 text-sm text-[#999591]">Carregando avaliacoes...</p>
            )}
            {reviewsError && <p className="mt-4 text-sm text-red-400">{reviewsError}</p>}
            {!reviewsLoading && !reviewsError && reviewsSummary && (
              <>
                {reviewsSummary.avaliacoes.length === 0 ? (
                  <p className="mt-4 text-sm text-[#999591]">
                    Ninguem avaliou este filme ainda. Seja o primeiro a comentar!
                  </p>
                ) : (
                  <div className="mt-4 flex flex-col">
                    {reviewsSummary.avaliacoes.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-[#2B2833] py-4 last:border-b-0"
                      >
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="font-secondary text-base font-semibold text-white">
                              {review.usuarioNome}
                            </p>
                            <span className="text-xs text-[#999591]">
                              {formatReviewDate(review.atualizadoEm)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <StarRating value={review.nota} size={20} />
                            <span className="text-sm font-medium text-[#FF859B]">
                              {review.nota.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        {review.comentario && (
                          <p className="mt-2 text-sm text-[#C4C4CC]">{review.comentario}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
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
