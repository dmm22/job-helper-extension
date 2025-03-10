export type JobRecord = {
  applicationDate: Date
  companyName: string
  url: string
  note: string
}

export type StorageSchema = {
  jobRecords: JobRecord[]
}
