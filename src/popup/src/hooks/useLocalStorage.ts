import { useState, useEffect } from "react"

export default function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    return getSavedValue<T>(key, initialValue)
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value])

  return [value as T, setValue] as const
}

function getSavedValue<T>(key: string, initialValue: T) {
  const savedValue = localStorage.getItem(key)
  if (savedValue) return JSON.parse(savedValue)

  if (initialValue instanceof Function) return initialValue()
  return initialValue
}
