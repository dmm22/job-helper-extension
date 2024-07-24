import { useCallback } from "react"

import NewRecordForm from "./components/NewRecordForm"
import RecordTableRow from "./components/RecordTableRow"

import useLocalStorage from "./hooks/useLocalStorage"

import { JobRecord } from "../../types"

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

  const minRows = 10
  const tableFillerRows: JSX.Element[] = Array(minRows - jobRecords.length).fill(<RecordTableRow />)

  return (
    <DevWrapper>
      <div className="w-[800px] p-2">
        <main className=" outline-sky-600 px-2 py-1.5 rounded outline outline-1">
          <section className="mb-8">
            <h2 className="mb-1.5 text-2xl font-bold text-sky-700">Record Application Details</h2>
            <hr />
            <NewRecordForm addJobRecord={addJobRecord} />
          </section>
          <section>
            <h2 className="mb-1.5 text-2xl font-bold text-sky-700">Application History</h2>
            <hr />
            <table className="w-full">
              <thead>
                <tr className="grid grid-cols-[1fr_1fr_auto]">
                  <th>Application Date</th>
                  <th>Company Name</th>
                  <th className="m-auto ">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y rounded divide-dashed outline outline-1 outline-zinc-200">
                {jobRecords.map(record => (
                  <RecordTableRow key={record.applicationDate.toString()} record={record} />
                ))}
                {tableFillerRows.length > 0 && tableFillerRows}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </DevWrapper>
  )
}
