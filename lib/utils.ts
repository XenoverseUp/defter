import { clsx, type ClassValue } from "clsx";
import { ClientResponse } from "hono/client";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
