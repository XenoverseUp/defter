import type { MutatorOptions, MutatorCallback } from "swr"
import useSWR, { mutate } from "swr"

import { getStudents, type StudentData } from "@/lib/client-services/students"

const key = "students" as const

export function useStudents({ fallbackData }: { fallbackData: StudentData[] }) {
  const swr = useSWR(key, () => getStudents(), {
    fallbackData,
    revalidateOnMount: true,
    keepPreviousData: true,
    refreshWhenHidden: false,
    refreshInterval: 0,
  })

  return swr
}

export function mutateStudents(
  data?:
    | StudentData[]
    | Promise<StudentData[]>
    | MutatorCallback<StudentData[]>,
  opts?: MutatorOptions<StudentData[]>,
) {
  return mutate<StudentData[]>(key, data, opts)
}
