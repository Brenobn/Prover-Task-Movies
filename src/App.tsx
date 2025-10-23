import { Header } from "./components/Header"

function App() {

	return (
    <div className="grid h-screen grid-rows-[116px_1fr] bg-zinc-900">
      <Header />

      <main className="w-full overflow-y-auto">
        <div className="p-8">
          <h1 className="mt-6 font-primary font-bold text-2xl text-[#ff859b]">
            Hello world
          </h1>
        </div>
      </main>
    </div>
	)
}

export default App;
