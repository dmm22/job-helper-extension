import useLocalStorage from "./hooks/useLocalStorage"

export default function App() {
  const [items, setItems] = useLocalStorage<string[]>("items", [])

  const addItem = () => {
    const newItemNumber = items.length + 1
    setItems(prev => [...prev, `Item ${newItemNumber}`])
  }

  return (
    <main>
      <button className="px-2 py-1 text-white rounded bg-emerald-600" onClick={addItem}>
        Add 1
      </button>
      <ul>
        {items.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </main>
  )
}
