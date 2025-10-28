import { useEffect, useRef, useState } from "react"
import { FiArrowLeft, FiCamera, FiLock, FiMail, FiUser } from "react-icons/fi"
import { Link, Navigate } from "react-router-dom"
import { useUser } from "../contexts/UserContext"
import { updateUserProfile } from "../services/auth"

export function Perfil() {
  const { user, setUser } = useUser()
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setAvatarPreview(null)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setFeedback(null)
    setError(null)
  }, [user?.id])

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  const currentUser = user

  function handlePickAvatar() {
    fileRef.current?.click()
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }
    const url = URL.createObjectURL(file)
    setAvatarPreview(url)
    // TODO (.NET Identity): enviar arquivo de avatar para o backend e usar a URL retornada
  }

  async function handleSave() {
    setFeedback(null)
    setError(null)

    if (!currentPassword.trim()) {
      setError("Informe sua senha atual para atualizar o perfil.")
      return
    }

    if (!newPassword.trim()) {
      setError("Informe a nova senha para continuar.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("A nova senha e a confirmacao devem ser iguais.")
      return
    }

    setSaving(true)
    try {
      const updated = await updateUserProfile({
        currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      })
      setUser(updated)
      setFeedback("Senha atualizada com sucesso")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel atualizar")
    } finally {
      setSaving(false)
    }
  }

  const avatarUrl = avatarPreview ?? currentUser.avatarUrl

  return (
    <div className="flex min-h-screen flex-col relative">
      <div className="w-full border border-b border-b-[#3E3B47] bg-[#1C1B1E] px-32 py-11.25">
        <div className="flex items-center">
          <Link
            className="inline-flex items-center gap-2 text-[#FF859B] no-underline"
            to="/"
          >
            <FiArrowLeft />
            Voltar
          </Link>
        </div>
      </div>

      <div className="mt-2 flex flex-col items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="relative">
          {/** biome-ignore lint/a11y/useAltText: preview only */}
          {/** biome-ignore lint/nursery/useImageSize: ok */}
          {/** biome-ignore lint/performance/noImgElement: ok */}
          <img className="h-28 w-28 rounded-full object-cover" src={avatarUrl} />
          <button
            aria-label="Alterar foto"
            className="absolute right-0 bottom-0 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#FF859B] text-[#312E38]"
            onClick={handlePickAvatar}
            type="button"
          >
            <FiCamera />
          </button>
          <input
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
            ref={fileRef}
            type="file"
          />
        </div>

        <div className="mt-8 flex w-[380px] flex-col gap-4">
          <div className="flex items-center gap-2 rounded-xl bg-[#262529] px-4 py-3">
            <FiUser className="text-[#948F99]" />
            <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-white">
              {currentUser.username}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-[#262529] px-4 py-3">
            <FiMail className="text-[#948F99]" />
            <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-white">
              {currentUser.email ?? "Email nao informado"}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-[#262529] px-4 py-3">
            <FiLock className="text-[#948F99]" />
            <input
              className="w-full bg-transparent text-white placeholder:text-[#948F99] focus:outline-none"
              placeholder="Senha atual"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-[#262529] px-4 py-3">
            <FiLock className="text-[#948F99]" />
            <input
              className="w-full bg-transparent text-white placeholder:text-[#948F99] focus:outline-none"
              placeholder="Nova senha"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-[#262529] px-4 py-3">
            <FiLock className="text-[#948F99]" />
            <input
              className="w-full bg-transparent text-white placeholder:text-[#948F99] focus:outline-none"
              placeholder="Confirmar Senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          {feedback ? <p className="text-sm text-emerald-400">{feedback}</p> : null}

          <button
            className="mt-2 h-12 cursor-pointer rounded-lg bg-[#FF859B] font-medium text-[#3E3B47] disabled:opacity-60"
            onClick={handleSave}
            type="button"
            disabled={saving}
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  )
}
