import { useCallback } from "react"
import { JobRecord } from "../../../types"

type NewRecordFormProps = {
  addJobRecord: (newRecord: JobRecord) => void
}

export default function NewRecordForm({ addJobRecord }: NewRecordFormProps) {
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const target = e.target as HTMLFormElement
    const formData = new FormData(target)
    const formObj = Object.fromEntries(formData.entries()) as Omit<JobRecord, "applicationDate">

    addJobRecord({ ...formObj, applicationDate: new Date() })
  }, [])

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold">Record Application Details</h2>
      <hr />
      <div className="grid gap-1">
        <label className="font-medium" htmlFor="companyName">
          Company Name
        </label>
        <input name="companyName" />
      </div>
      <div className="grid gap-1">
        <label className="font-medium" htmlFor="url">
          URL
        </label>
        <input name="url" />
      </div>
      <div className="grid gap-1">
        <label className="font-medium" htmlFor="note">
          Note
        </label>
        <textarea rows={3} name="note"></textarea>
      </div>
      <button className="px-2 py-1 font-medium text-white bg-orange-500 rounded w-max">
        Submit
      </button>
    </form>
  )
}
