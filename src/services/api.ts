const DEFAULT_BASE_URL = "https://localhost:7192/api"

function normalizeBaseUrl(raw?: string | null) {
  if (!raw) return DEFAULT_BASE_URL
  return raw.replace(/\/+$/, "")
}

const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL as string | undefined)

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  json?: unknown
  body?: BodyInit | null
}

function buildUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

function isJsonLike(headers: Headers) {
  const contentType = headers.get("content-type")
  return contentType?.includes("application/json")
}

function pickProblemDetail(payload: Record<string, unknown>, key: string) {
  const value = payload[key]
  return typeof value === "string" && value.trim() ? value : null
}

function extractModelErrors(payload: Record<string, unknown>) {
  const errors =
    (typeof payload.errors === "object" && payload.errors) ||
    (typeof payload.Errors === "object" && payload.Errors)
  if (!errors) return null

  for (const value of Object.values(errors as Record<string, unknown>)) {
    if (typeof value === "string" && value.trim()) {
      return value
    }
    if (Array.isArray(value)) {
      const first = value.find(
        (item): item is string => typeof item === "string" && item.trim().length > 0,
      )
      if (first) {
        return first
      }
    }
  }

  return null
}

function buildErrorMessage(payload: unknown, status: number) {
  if (!payload || typeof payload !== "object") {
    if (typeof payload === "string" && payload.trim()) {
      return payload
    }
    return `Falha na requisicao (HTTP ${status})`
  }

  const record = payload as Record<string, unknown>

  const directMessage =
    pickProblemDetail(record, "message") ??
    pickProblemDetail(record, "Message") ??
    pickProblemDetail(record, "detail") ??
    pickProblemDetail(record, "Detail") ??
    pickProblemDetail(record, "title") ??
    pickProblemDetail(record, "Title")
  if (directMessage) {
    return directMessage
  }

  const modelError = extractModelErrors(record)
  if (modelError) {
    return modelError
  }

  return `Falha na requisicao (HTTP ${status})`
}

export async function apiRequest<TResponse = unknown>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const headers = new Headers(options.headers)
  let body = options.body ?? null

  if (options.json !== undefined) {
    body = JSON.stringify(options.json)
    headers.set("Content-Type", "application/json")
  } else if (body && !(body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  try {
    const response = await fetch(buildUrl(path), {
      ...options,
      headers,
      body,
      credentials: "include",
    })

    if (response.status === 204) {
      return undefined as TResponse
    }

    const shouldParseJson = isJsonLike(response.headers)
    const payload = shouldParseJson ? await response.json().catch(() => undefined) : undefined

    if (!response.ok) {
      const message = buildErrorMessage(payload, response.status)
      throw new Error(message)
    }

    return payload as TResponse
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Erro desconhecido ao comunicar com o servidor")
  }
}

export { API_BASE_URL }
