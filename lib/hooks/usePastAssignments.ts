import useSWR, { mutate, type MutatorCallback, type MutatorOptions } from "swr"

import {
  type PastAssignmentData,
  getPastAssignments,
} from "../client-services/assignments"
import { pastAssignmentKeyFor } from "./keys"

interface Params {
  id: string
  fallbackData?: PastAssignmentData
}

export function usePastAssignments({ id, fallbackData }: Params) {
  const key = pastAssignmentKeyFor(id)

  const swr = useSWR(key, () => getPastAssignments(id), {
    fallbackData,
    revalidateOnMount: true,
    keepPreviousData: true,
    refreshWhenHidden: false,
    refreshInterval: 0,
  })

  return {
    ...swr,
    arePastAssigmentsLoading: swr.isLoading,
    pastAssignments: swr.data,
    key,
  }
}

export function mutatePastAssignment(
  id: string,
  data?:
    | PastAssignmentData[]
    | Promise<PastAssignmentData[]>
    | MutatorCallback<PastAssignmentData[]>,
  opts?: MutatorOptions<PastAssignmentData[]>,
) {
  return mutate<PastAssignmentData[]>(pastAssignmentKeyFor(id), data, opts)
}
