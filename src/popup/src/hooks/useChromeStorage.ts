import { useState, useEffect } from "react"

const getStorage = async <T>(key: string) => {
  const savedValue = await chrome.storage.local.get(key)
  return Object.keys(savedValue).length === 0 ? null : (savedValue[key] as T)
}

const setStorage = async <T>(key: string, value: T) => {
  await chrome.storage.local.set({ [key]: value })
}

const useChromeStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(initialValue)

  useEffect(() => {
    handleInitialValue()
  }, [])

  useEffect(() => {
    setStorage(key, value)
  }, [value])

  async function handleInitialValue() {
    const existingValue = await getStorage<T>(key)
    const test = existingValue || initialValue
    setValue(test)
  }

  return [value, setValue] as const
}

export default useChromeStorage
