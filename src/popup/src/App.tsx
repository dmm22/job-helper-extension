import NewRecordForm from "./components/NewRecordForm"

import useLocalStorage from "./hooks/useLocalStorage"

import { JobRecord } from "../../types"
import { useCallback } from "react"

export default function App() {
  const [jobRecords, setJobRecords] = useLocalStorage<JobRecord[]>("items", [])

  const addJobRecord = useCallback(
    (newRecord: JobRecord) => {
      setJobRecords(prevRecords => [newRecord, ...prevRecords])
    },
    [jobRecords]
  )

  const DevWrapper = ({ children }: { children: React.ReactNode }) => {
    const inDevelopment = window.location.href === "http://localhost:5173/"
    if (!inDevelopment) return children

    return (
      <div className="grid items-center w-screen h-screen place-content-center">
        <div className="overflow-hidden outline outline-1 outline-zinc-200">{children}</div>
      </div>
    )
  }

  return (
    <DevWrapper>
      <main className="m-2 w-[800px] h-[600px]">
        <section>
          <NewRecordForm addJobRecord={addJobRecord} />
        </section>
        <section>
          {jobRecords.map(record => (
            <pre key={record.applicationDate.toString()}>{JSON.stringify(record, null, 2)}</pre>
          ))}
        </section>
      </main>
    </DevWrapper>
  )
}
