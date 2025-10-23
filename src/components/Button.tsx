import type { IconType } from "react-icons";

type ButtonProps = {
  icon?: IconType;
  title: string;
};

export function Button({ icon: Icon, title, ...rest }: ButtonProps) {
  return (
    <button className="w-full bg-[#FF859B] text-[#3E3B47] h-14 border-0 py-0 px-4 rounded-[10px] font-medium"
      type="button"
      {...rest}
    >
      {Icon && <Icon size={16} />} 
      {title}
    </button>
  )
}