import useSWR, { mutate, type MutatorCallback, type MutatorOptions } from "swr"

import {
  type ActiveAssignmentData,
  getActiveAssignment,
} from "../client-services/assignments"

const keyFor = (id: string) => `student-active-assignment/${id}` as const

interface Params {
  id: string
  fallbackData?: ActiveAssignmentData
}

export function useActiveAssignment({ id, fallbackData }: Params) {
  const key = keyFor(id)

  const swr = useSWR(key, () => getActiveAssignment(id), {
    fallbackData,
    revalidateOnMount: true,
    keepPreviousData: true,
  })

  return {
    activeAssignment: swr.data,
    isActiveAssignmentLoading: swr.isLoading,
    isValidating: swr.isValidating,
    error: swr.error,
    key,
  }
}

export function mutateActiveAssignment(
  id: string,
  data?:
    | ActiveAssignmentData[]
    | Promise<ActiveAssignmentData[]>
    | MutatorCallback<ActiveAssignmentData[]>,
  opts?: MutatorOptions<ActiveAssignmentData[]>,
) {
  return mutate<ActiveAssignmentData[]>(keyFor(id), data, opts)
}
