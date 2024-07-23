import { useState } from "react"

export default function App() {
  const [counter, setCounter] = useState(0)
  return (
    <main>
      <button
        className="px-2 py-1 text-white rounded bg-emerald-600"
        onClick={() => setCounter(prev => prev + 1)}
      >
        Add 1
      </button>
      <h1 className="text-5xl text-blue-500">TEST!</h1>
      <h1 className="text-2xl">{counter}</h1>
    </main>
  )
}
