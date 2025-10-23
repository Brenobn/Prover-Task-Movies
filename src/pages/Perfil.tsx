import { useRef, useState } from "react"
import { FiArrowLeft, FiCamera, FiLock, FiMail, FiUser } from "react-icons/fi"
import { Link } from "react-router-dom"
import { useUser } from "../contexts/UserContext"

export function Perfil() {
  const { user, setUser } = useUser()
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  function handlePickAvatar() {
    fileRef.current?.click()
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) { return }
    const url = URL.createObjectURL(file)
    setAvatarPreview(url)
  }

  function handleSave() {
    setUser({
      name,
      email,
      avatar: avatarPreview ?? user.avatar,
    })
  }

  const avatarUrl = avatarPreview ?? user.avatar

  return (
    <div className="px-32 py-10">
      <Link
        className="inline-flex items-center gap-2 text-[#FF859B] no-underline"
        to={"/"}
      >
        <FiArrowLeft />
        Voltar
      </Link>

      <div className="mt-6 flex flex-col items-center">
        <div className="relative">
          {/** biome-ignore lint/a11y/useAltText: preview only */}
          {/** biome-ignore lint/nursery/useImageSize: ok */}
          {/** biome-ignore lint/performance/noImgElement: ok */}
          <img
            className="h-28 w-28 rounded-full object-cover"
            src={avatarUrl}
          />
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
            <input
              className="w-full bg-transparent text-white placeholder:text-[#948F99] focus:outline-none"
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              value={name}
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-[#262529] px-4 py-3">
            <FiMail className="text-[#948F99]" />
            <input
              className="w-full bg-transparent text-white placeholder:text-[#948F99] focus:outline-none"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu e-mail"
              value={email}
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-[#262529] px-4 py-3">
            <FiLock className="text-[#948F99]" />
            <input
              className="w-full bg-transparent text-white placeholder:text-[#948F99] focus:outline-none"
              placeholder="Senha atual"
              type="password"
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-[#262529] px-4 py-3">
            <FiLock className="text-[#948F99]" />
            <input
              className="w-full bg-transparent text-white placeholder:text-[#948F99] focus:outline-none"
              placeholder="Nova senha"
              type="password"
            />
          </div>

          <button
            className="mt-2 h-12 cursor-pointer rounded-lg bg-[#FF859B] font-medium text-[#3E3B47]"
            onClick={handleSave}
            type="button"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}
