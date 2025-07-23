import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export namespace DateUtils {
  export function format(
    date: Date,
    options: Intl.DateTimeFormatOptions,
    locale: string = "en-US",
  ) {
    return new Intl.DateTimeFormat(locale, options).format(date)
  }

  export function getCurrentWeekdates() {
    return Array.from(Array(7).keys()).map((idx) => {
      const d = new Date()
      d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + idx)
      return d
    })
  }

  export function getStartOfTheWeek() {
    return getCurrentWeekdates().at(0)!
  }

  export function isToday(date: Date): boolean {
    const today = new Date()
    return (
      today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth() &&
      today.getDate() === date.getDate()
    )
  }
}
