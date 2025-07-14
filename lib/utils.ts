import { FormSchema } from "@/app/[locale]/dashboard/create/page";
import { clsx, type ClassValue } from "clsx";
import { ClientResponse } from "hono/client";
import { twMerge } from "tailwind-merge";
import { StudentData } from "./client-services/students";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
