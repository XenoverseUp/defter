import { clsx, type ClassValue } from "clsx";

import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date, options: Intl.DateTimeFormatOptions, locale: string = "en-US") {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function addDays(date: Date, n: number) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + n);
  return newDate;
}

export function subDays(date: Date, n: number) {
  return addDays(date, -n);
}

export function addWeeks(date: Date, n: number) {
  return addDays(date, 7 * n);
}

export function subWeeks(date: Date, n: number) {
  return addWeeks(date, -n);
}

export function addMonths(date: Date, n: number) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + n);
  return newDate;
}

export function subMonths(date: Date, n: number) {
  return addMonths(date, -n);
}

export function addYears(date: Date, n: number) {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + n);
  return newDate;
}

export function subYears(date: Date, n: number) {
  return addYears(date, -n);
}

export function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function isSameHour(a: Date, b: Date) {
  return isSameDay(a, b) && a.getHours() === b.getHours();
}

export function differenceInMinutes(a: Date, b: Date) {
  return Math.floor((a.getTime() - b.getTime()) / 1000 / 60);
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function startOfWeek(date: Date, options = { weekStartsOn: 0 }) {
  const day = date.getDay();
  const diff = (day < options.weekStartsOn ? 7 : 0) + day - options.weekStartsOn;
  return addDays(date, -diff);
}

export function setHours(date: Date, hours: number) {
  const newDate = new Date(date);
  newDate.setHours(hours, 0, 0, 0);
  return newDate;
}

export function setMonth(date: Date, month: number) {
  const newDate = new Date(date);
  newDate.setMonth(month);
  return newDate;
}

export function isToday(date: Date) {
  const today = new Date();
  return isSameDay(date, today);
}

export type CalendarLocale = string | Intl.Locale;

export function resolveLocale(locale?: CalendarLocale): string {
  if (!locale) return "en-US";
  return typeof locale === "string" ? locale : locale.toString();
}

export function generateWeekdays(locale: CalendarLocale) {
  const loc = resolveLocale(locale);
  const start = startOfWeek(new Date(), { weekStartsOn: 0 });
  return Array.from({ length: 7 }).map((_, i) => formatDate(addDays(start, i), { weekday: "narrow" }, loc));
}
