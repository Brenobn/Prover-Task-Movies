/** biome-ignore-all lint/a11y/useValidAnchor: Never mind */
import { Input } from "./Input"

export function Header() {
  return (
    <div className="flex justify-between bg-[#1C1B1E] py-6 px-32 w-full border border-b border-b-[#3E3B47]">
      <div className="flex w-full py-[24px] px-[70px] items-center gap-16">
        <h1 className="text-[#FF859B] font-bold font-secondary text-2xl">Movies</h1>
        <Input />
        <div className="inline-flex h-16 items-center gap-2.5">
          <div className="inline-flex flex-col items-end">
            <a href="#" className="text-white font-secondary text-sm font-bold no-underline">Breno</a>
            <a href="#" className="text-[#948F99] font-secondary text-sm font-normal">sair</a>
          </div>

          {/** biome-ignore lint/a11y/useAltText: Never mind */}
          <img src="https://github.com/Brenobn.png" className="w-16 h-16 rounded-4xl border-[#3e3b47]"/>
        </div>
      </div>
    </div>
  )
}