const formatDate = (dateString: Date): string => {
  const date = new Date(dateString)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? "PM" : "AM"
  const formattedHours = hours % 12 || 12

  const MMDDYYYY = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  const hhmmA = `${formattedHours}:${minutes} ${ampm}`

  return `${MMDDYYYY} ${hhmmA}`
}

export default formatDate
