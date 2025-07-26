import { gradeEnum, subjectEnum } from "@/db/schema"
import { clsx, type ClassValue } from "clsx"

import { twMerge } from "tailwind-merge"
import {
  AtomIcon,
  BookTypeIcon,
  ConeIcon,
  FlaskConicalIcon,
  LanguagesIcon,
  LeafIcon,
  MapIcon,
  PersonStandingIcon,
  PiIcon,
  SwordsIcon,
} from "lucide-react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export namespace StudentUtils {
  export type Subject = (typeof subjectEnum.enumValues)[number]
  export type Grade = (typeof gradeEnum.enumValues)[number]

  export function subjectIcon(subject: Subject, grade?: Grade) {
    switch (subject) {
      case "turkish":
        return BookTypeIcon
      case "english":
        return LanguagesIcon
      case "math":
        return PiIcon
      case "social-studies":
        return PersonStandingIcon
      case "science":
        return FlaskConicalIcon
      case "geometry":
        return ConeIcon
      case "physics":
        return AtomIcon
      case "chemistry":
        return FlaskConicalIcon
      case "biology":
        return LeafIcon
      case "history":
        return SwordsIcon
      case "geography":
        return MapIcon
    }
  }
}

export namespace DateUtils {
  export function format(
    date: Date,
    options: Intl.DateTimeFormatOptions,
    locale: string = "en-US",
  ) {
    return new Intl.DateTimeFormat(locale, options).format(date)
  }

  export function getWeekdates(date: Date) {
    return Array.from(Array(7).keys()).map((idx) => {
      const d = new Date(date.getTime())
      d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + idx)
      return d
    })
  }

  export function getCurrentWeekdates() {
    return getWeekdates(new Date())
  }

  export function getStartOfTheCurrentWeek() {
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
