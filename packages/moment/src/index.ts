import moment, { DurationInputArg2, unitOfTime, MomentInput } from 'moment'
import 'moment/locale/zh-cn'

export const yyyyMMDDHHmmss = 'yyyy-MM-DD HH:mm:ss'
export const yyyyMMDDHHmm = 'yyyy-MM-DD HH:mm'
export const yyyyMMDD = 'yyyy-MM-DD'

export const getLastMonthRange = (
  time?: MomentInput,
  type: unitOfTime.StartOf = 'month'
) => {
  let timeMoment
  const dateType = `${type}s` as DurationInputArg2
  if (time) {
    timeMoment = moment(time)
  } else {
    timeMoment = moment().subtract(1, dateType)
  }

  const firstDay = timeMoment.startOf(type).format(yyyyMMDD)
  const lastDay = timeMoment.add(1, dateType).startOf(type).format(yyyyMMDD)
  return { firstDay, lastDay }
}

export const transformTimeToUtc = (time: MomentInput): string => {
  return moment(time).utc().format()
}

export const getFormUtcToLocalMoment = (time: string) => {
  const m = moment.utc(time)
  return m.utcOffset(moment.parseZone().utcOffset())
}

export const transformUtcToLocal = (
  time: string,
  format = yyyyMMDDHHmmss
): string => {
  return getFormUtcToLocalMoment(time).format(format)
}

export const getFromNowString = (time: MomentInput): string => {
  const now = moment.utc()
  const incomingTime = moment.utc(time)
  if (moment(now).isBefore(incomingTime)) {
    return now.fromNow()
  }
  return incomingTime.fromNow()
}

export const orgMoment = moment

export const transformYears = start => {
  const years = moment().diff(moment(start), 'years')
  return years < 1 ? '' : `${years}`
}

export const transformDateYM = (start, end) => {
  if (!start || !end) return null
  const startDate = moment(new Date(start))
  const endDate = moment(new Date(end))
  const startMonths = startDate.year() * 12 + startDate.month()
  const endMonths = endDate.year() * 12 + endDate.month()
  const years = Number.parseInt(`${(endMonths - startMonths) / 12}`, 10)
  const months = (endMonths - startMonths) % 12
  if (!years && !months) return null
  if (months === 0) return `${years}年`
  return (years > 0 ? `${years}年` : '') + (months > 0 ? `${months}个月` : '')
}
