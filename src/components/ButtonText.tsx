import type { IconType } from "react-icons";
import { Link } from "react-router-dom";

type ButtonTextProps = {
	icon?: IconType;
  title: string;
};

export function ButtonText({ icon: Icon, title }: ButtonTextProps) {
	return (
		<Link
			to="/"
			className="bg-none text-[#FF859B] border-0 text-base inline-flex items-center gap-2 [&_svg]:text-[#FF859B]"
		>
			{Icon && <Icon size={20} />}
      {title}
		</Link>
	);
}
