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
