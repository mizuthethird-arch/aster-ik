const stack = ['React 19', 'Vite 8', 'TypeScript 7', 'Tailwind 4', 'ESLint + Prettier']

function App() {
  return (
    <main className="min-h-svh bg-slate-950 p-6 text-slate-100 sm:p-10">
      <section className="mx-auto max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl">
        <p className="text-xs font-semibold tracking-[0.3em] text-indigo-400 uppercase">aster-ik</p>
        <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Frontend scaffold is live</h1>
        <p className="mt-4 text-sm text-slate-400">
          Vite + TypeScript + Tailwind, served from the Docker dev workspace. Edit{' '}
          <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-slate-200">
            src/App.tsx
          </code>{' '}
          and the browser updates without a reload.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2 text-xs font-medium">
          {stack.map((label) => (
            <li
              key={label}
              className="rounded-full bg-indigo-500/10 px-3 py-1 text-indigo-300 ring-1 ring-indigo-500/30"
            >
              {label}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default App
