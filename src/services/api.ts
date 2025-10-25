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
      const message =
        payload?.message ??
        payload?.Message ??
        (typeof payload === "string" ? payload : null) ??
        `Falha na requisicao (HTTP ${response.status})`
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

