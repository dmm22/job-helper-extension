import { CgNotes } from "react-icons/cg"
import { FaTrashAlt } from "react-icons/fa"
import { FiLink } from "react-icons/fi"

import formatDate from "../utils/formatDate"

import { JobRecord } from "../../../types"

type RecordTableRowProps = {
  record?: JobRecord
  removeJobRecord?: (recordToRemove: JobRecord) => void
}

export default function RecordTableRow({ record, removeJobRecord }: RecordTableRowProps) {
  return (
    <tr className="grid grid-cols-[1fr_1fr_auto] gap-2 px-2 py-1.5">
      <td>{record ? formatDate(record?.applicationDate) : "\u00A0"}</td>
      <td>{record?.companyName}</td>
      <td className="[&>*]:cursor-pointer text-zinc-600 flex gap-2">
        {record && removeJobRecord && (
          <>
            <CgNotes className="size-5" />
            <a href={record.url} target="_blank">
              <FiLink className=" size-5" />
            </a>
            <FaTrashAlt className="size-5" onClick={() => removeJobRecord(record)} />
          </>
        )}
      </td>
    </tr>
  )
}
