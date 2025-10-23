import { Outlet } from "react-router-dom";
import { Header } from "./components/Header";

export function App() {
	return (
		<div className="grid h-screen grid-rows-[116px_1fr] bg-zinc-900">
			<Header />

			<main className="w-full overflow-y-auto">
				<Outlet />
			</main>
		</div>
	);
}
