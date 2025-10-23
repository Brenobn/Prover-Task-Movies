<<<<<<< HEAD
import type { InputHTMLAttributes } from "react";
import type { IconType } from "react-icons";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	icon?: IconType;
};

export function Input({ icon: Icon, ...rest }: InputProps) {
	return (
		<div className="w-full flex items-center bg-[#262529] text-[#948F99] rounded-[10px]">
			<input className="flex-1 h-14 py-5 text-white bg-transparent border-0 placeholder:text-[#948F99] focus:outline-none" 
        {...rest}
      />
		</div>
	);
}
=======
export function Input() {
  return (
    <div className="flex w-full items-center rounded-[10px] bg-[#262529] text-[#948F99]">
      <input className="h-14 w-full border-0 bg-transparent px-6 py-5 text-white placeholder:text-[#948F99]" placeholder="Pesquisar pelo título" />
    </div>
  )
}
>>>>>>> 8e6293a4fd0554b874916fa49a17a76c732b8ef3
