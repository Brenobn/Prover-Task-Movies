import { useEffect, useState } from "react"
import { GoArrowLeft } from "react-icons/go"
import { useParams } from "react-router-dom"
import { ButtonText } from "../components/ButtonText"
import { StarRating } from "../components/StarRating"
import { Tag } from "../components/Tag"
import { getMovieById, submitMovieRating, type Movie } from "../services/movies"

export function Details() {
  const { movieId } = useParams<{ movieId: string }>()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userRating, setUserRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!movieId) {
      setError("Filme não encontrado")
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
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Erro ao carregar filme")
      })
      .finally(() => setLoading(false))

    return () => ctrl.abort()
  }, [movieId])

  async function handleSubmitRating() {
    if (!movieId) {
      setSubmitError("Filme não encontrado")
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
      await submitMovieRating(movieId, userRating)
      setSubmitSuccess("Avaliação enviada!")
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Não foi possível registrar sua avaliação")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto my-10 flex max-w-6xl flex-col gap-10">
      <div className="flex items-center gap-2">
        {/** biome-ignore assist/source/useSortedAttributes: ok */}
        <ButtonText title="Voltar" icon={GoArrowLeft} />
      </div>

      {loading && (
        <p className="font-primary text-[#999591] text-base">Carregando filme...</p>
      )}
      {error && <p className="font-primary text-base text-red-400">{error}</p>}

      {!(loading || error ) && movie && (
        <>
          <div className="inline-flex flex-row items-center">
            <h1 className="mr-5 font-medium font-secondary text-4xl text-white">
              {movie.title}
            </h1>
            <div className="flex items-center gap-2">
              <StarRating value={movie.rating} size={24} />
              <span className="font-medium text-[#FF859B] text-sm">
                {movie.rating.toFixed(1)}
              </span>
              </div>
          </div>

          {movie.tags.length > 0 && (
            <div className="inline-flex items-start gap-2">
              {movie.tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>
          )}

          <p className="font-normal font-secondary text-base text-white">
            {movie.description}
          </p>

          <div className="rounded-xl bg-[#0D0C0F] p-6">
            <h2 className="font-secondary text-lg font-semibold text-white">
              O que achou do filme?
            </h2>
            <p className="mt-1 text-sm text-[#999591]">
              Escolha uma nota de 1 a 5 estrelas para contribuir com a média do filme.
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
                {submitting ? "Enviando..." : "Enviar avaliação"}
              </button>
            </div>
            {submitError && (
              <p className="mt-2 text-sm text-red-400">{submitError}</p>
            )}
            {submitSuccess && (
              <p className="mt-2 text-sm text-emerald-400">{submitSuccess}</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
