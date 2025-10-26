import { apiRequest } from "./api"

export type MovieReview = {
  id: string
  usuarioId: string
  usuarioNome: string
  nota: number
  comentario?: string | null
  atualizadoEm: string
}

export type MovieReviewSummary = {
  media: number
  totalAvaliacoes: number
  suaNota: number
  seuComentario?: string | null
  avaliacoes: MovieReview[]
}

export type SubmitMovieReviewPayload = {
  nota: number
  comentario?: string | null
}

export type SubmitMovieReviewResponse = {
  message?: string
  media: number
  suaNota: number
  seuComentario?: string | null
}

type ApiMovieReview = {
  id: string
  usuarioId: string
  usuarioNome: string
  nota: number
  comentario?: string | null
  atualizadoEm: string
}

type ApiMovieReviewSummary = {
  media: number
  totalAvaliacoes?: number
  suaNota?: number
  seuComentario?: string | null
  avaliacoes?: ApiMovieReview[]
}

const MOVIE_REVIEWS_BASE_PATH = "/Avaliacao"

function buildReviewsPath(movieId: string) {
  return `${MOVIE_REVIEWS_BASE_PATH}/${movieId}`
}

function mapMovieReview(review: ApiMovieReview): MovieReview {
  return {
    id: review.id,
    usuarioId: review.usuarioId,
    usuarioNome: review.usuarioNome,
    nota: review.nota,
    comentario: review.comentario,
    atualizadoEm: review.atualizadoEm,
  }
}

function mapMovieReviewSummary(summary: ApiMovieReviewSummary): MovieReviewSummary {
  const reviews = summary.avaliacoes?.map(mapMovieReview) ?? []
  return {
    media: typeof summary.media === "number" ? summary.media : 0,
    totalAvaliacoes: summary.totalAvaliacoes ?? reviews.length,
    suaNota: summary.suaNota ?? 0,
    seuComentario: summary.seuComentario ?? null,
    avaliacoes: reviews,
  }
}

export async function getMovieReviews(
  movieId: string,
  signal?: AbortSignal,
): Promise<MovieReviewSummary> {
  const payload = await apiRequest<ApiMovieReviewSummary>(buildReviewsPath(movieId), {
    method: "GET",
    signal,
  })
  return mapMovieReviewSummary(payload)
}

export async function submitMovieReview(
  movieId: string,
  payload: SubmitMovieReviewPayload,
  signal?: AbortSignal,
): Promise<SubmitMovieReviewResponse> {
  return apiRequest<SubmitMovieReviewResponse>(buildReviewsPath(movieId), {
    method: "POST",
    json: payload,
    signal,
  })
}
