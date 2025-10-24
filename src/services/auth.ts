export type AuthUser = {
  id: string
  name: string
  email: string
  avatar: string
}

type StoredUser = AuthUser & { password: string }

type RegisterPayload = {
  name: string
  email: string
  password: string
}

type LoginPayload = {
  email: string
  password: string
}

type UpdateProfilePayload = {
  userId: string
  name: string
  email: string
  avatar?: string
  currentPassword?: string
  newPassword?: string
}

const STORAGE_KEY = "prover-movies:users"

function loadMockUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw) as StoredUser[]
    }
  } catch {}
  return []
}

function saveMockUsers(users: StoredUser[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
  } catch {}
}

function createAvatar(email: string): string {
  const encoded = encodeURIComponent(email.toLowerCase())
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${encoded}`
}

export async function registerUser(
  payload: RegisterPayload,
  signal?: AbortSignal,
): Promise<AuthUser> {
  const baseURL = import.meta.env.VITE_API_BASE_URL as string | undefined
  if (baseURL) {
    const res = await fetch(`${baseURL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal,
    })
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }
    const data = (await res.json()) as AuthUser
    return data
  }

  // TODO (.NET Identity): remover mock quando os endpoints estiverem prontos
  const users = loadMockUsers()
  const exists = users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())
  if (exists) {
    throw new Error("Email ja registrado")
  }

  const user: StoredUser = {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()),
    name: payload.name,
    email: payload.email,
    avatar: createAvatar(payload.email),
    password: payload.password,
  }
  users.push(user)
  saveMockUsers(users)

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  }
}

export async function loginUser(
  payload: LoginPayload,
  signal?: AbortSignal,
): Promise<AuthUser> {
  const baseURL = import.meta.env.VITE_API_BASE_URL as string | undefined
  if (baseURL) {
    const res = await fetch(`${baseURL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal,
    })
    if (!res.ok) {
      throw new Error(res.status === 401 ? "Credenciais invalidas" : `HTTP ${res.status}`)
    }
    return (await res.json()) as AuthUser
  }

  // TODO (.NET Identity): remover mock quando os endpoints estiverem prontos
  const users = loadMockUsers()
  const user = users.find(
    (u) => u.email.toLowerCase() === payload.email.toLowerCase() && u.password === payload.password,
  )
  if (!user) {
    throw new Error("Credenciais invalidas")
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  }
}

export async function updateUserProfile(
  payload: UpdateProfilePayload,
  signal?: AbortSignal,
): Promise<AuthUser> {
  const baseURL = import.meta.env.VITE_API_BASE_URL as string | undefined
  if (baseURL) {
    // TODO (.NET Identity): substituir por chamada PUT/PATCH para atualizar o usuario autenticado
    const res = await fetch(`${baseURL}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal,
    })
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }
    return (await res.json()) as AuthUser
  }

  // TODO (.NET Identity): remover mock quando os endpoints estiverem prontos
  const users = loadMockUsers()
  const idx = users.findIndex((u) => u.id === payload.userId)
  if (idx === -1) {
    throw new Error("Usuario nao encontrado")
  }
  if (
    users.some(
      (u, i) =>
        i !== idx &&
        u.email.toLowerCase() === payload.email.toLowerCase(),
    )
  ) {
    throw new Error("Email ja utilizado")
  }

  const stored = users[idx]
  if (payload.newPassword) {
    if (!payload.currentPassword) {
      throw new Error("Informe a senha atual para alterar a senha")
    }
    if (stored.password !== payload.currentPassword) {
      throw new Error("Senha atual incorreta")
    }
    stored.password = payload.newPassword
  }

  stored.name = payload.name
  stored.email = payload.email
  if (payload.avatar) {
    stored.avatar = payload.avatar
  }

  saveMockUsers(users)

  return {
    id: stored.id,
    name: stored.name,
    email: stored.email,
    avatar: stored.avatar,
  }
}

