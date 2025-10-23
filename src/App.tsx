import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./components/Header";

export function App() {
	const location = useLocation();
	const hideHeader = location.pathname === "/perfil";

	return (
		<div
			className={`grid h-screen ${hideHeader ? "grid-rows-1" : "grid-rows-[116px_1fr]"} bg-zinc-900`}
		>
			{!hideHeader && <Header />}

			<main className="w-full overflow-y-auto">
				<Outlet />
			</main>
		</div>
	);
}
