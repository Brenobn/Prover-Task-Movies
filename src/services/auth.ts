import { apiRequest } from "./api"

export type AuthUser = {
  id: string
  username: string
  email?: string | null
  avatarUrl: string
  roles: string[]
}

export type RegisterPayload = {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export type LoginPayload = {
  username: string
  password: string
}

type StatusResponse = {
  authenticated: boolean
  id?: string
  username?: string
  email?: string | null
  roles?: string[]
  isAdmin?: boolean
}

const ACCOUNT_BASE_URL = "/Account"

function buildAvatar(seed: string) {
  const normalized = seed.trim().toLowerCase() || "usuario"
  const encoded = encodeURIComponent(normalized)
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${encoded}`
}

function mapStatusToUser(status: StatusResponse): AuthUser | null {
  if (!status.authenticated || !status.username) {
    return null
  }

  const normalizedRoles = status.roles ?? (status.isAdmin ? ["Admin"] : [])

  return {
    id: status.id ?? "",
    username: status.username,
    email: status.email ?? null,
    avatarUrl: buildAvatar(status.username),
    roles: normalizedRoles,
  }
}

export async function registerUser(payload: RegisterPayload, signal?: AbortSignal) {
  await apiRequest(`${ACCOUNT_BASE_URL}/register`, {
    method: "POST",
    json: payload,
    signal,
  })
}

export async function loginUser(payload: LoginPayload, signal?: AbortSignal) {
  await apiRequest(`${ACCOUNT_BASE_URL}/login`, {
    method: "POST",
    json: payload,
    signal,
  })
}

export async function logoutUser(signal?: AbortSignal) {
  await apiRequest(`${ACCOUNT_BASE_URL}/logout`, {
    method: "POST",
    signal,
  })
}

export async function fetchCurrentUser(signal?: AbortSignal): Promise<AuthUser | null> {
  const status = await apiRequest<StatusResponse>(`${ACCOUNT_BASE_URL}/status`, {
    method: "GET",
    signal,
  })
  return mapStatusToUser(status)
}

export type UpdateProfilePayload = {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export async function updateUserProfile(payload: UpdateProfilePayload): Promise<AuthUser> {
  const { currentPassword, newPassword, confirmNewPassword } = payload

  if (!currentPassword) {
    throw new Error("Informe sua senha atual para atualizar o perfil.")
  }

  if (!newPassword) {
    throw new Error("Informe a nova senha para continuar.")
  }

  await apiRequest(`${ACCOUNT_BASE_URL}/update-account`, {
    method: "PUT",
    json: {
      CurrentPassword: currentPassword,
      NewPassword: newPassword,
      ConfirmNewPassword: confirmNewPassword,
    },
  })

  const refreshedUser = await fetchCurrentUser()
  if (!refreshedUser) {
    throw new Error("Perfil atualizado, mas nao foi possivel carregar os dados do usuario.")
  }

  return refreshedUser
}
