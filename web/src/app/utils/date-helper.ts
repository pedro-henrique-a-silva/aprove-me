import moment from 'moment'

export function formatDate(date: string): string {
  return moment(date).format('DD/MM/YYYY')
}

export function formatDateToApiFormat(date: string): string {
  return moment(date).format('YYYY-MM-DD')
}

export function formatToDate(date: string): Date {
  return moment(date).startOf('day').toDate()
}