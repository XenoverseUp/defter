import useSWR, { mutate, type MutatorCallback, type MutatorOptions } from "swr"

import {
  type ActiveAssignmentData,
  getActiveAssignment,
} from "../client-services/assignments"
import { activeAssignmentKeyFor } from "./keys"

interface Params {
  id: string
  fallbackData?: ActiveAssignmentData
}

export function useActiveAssignment({ id, fallbackData }: Params) {
  const key = activeAssignmentKeyFor(id)

  const swr = useSWR(key, () => getActiveAssignment(id), {
    fallbackData,
    revalidateOnMount: true,
    keepPreviousData: true,
    refreshWhenHidden: false,
    refreshInterval: 0,
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
  return mutate<ActiveAssignmentData[]>(activeAssignmentKeyFor(id), data, opts)
}
