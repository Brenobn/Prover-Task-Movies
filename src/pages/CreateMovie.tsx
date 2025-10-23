import { FiArrowLeft } from "react-icons/fi"
import { Link } from "react-router-dom"

export function CreateMovie() {
  return (
    <div className="px-32 py-10">
      <Link
        className="inline-flex items-center gap-2 text-[#FF859B] no-underline"
        to="/"
      >
        <FiArrowLeft />
        Voltar
      </Link>

      <h1 className="mt-6 font-bold font-secondary text-4xl text-white">
        Novo filme
      </h1>
    </div>
  )
}
