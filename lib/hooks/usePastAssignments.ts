import useSWR, { mutate, type MutatorCallback, type MutatorOptions } from "swr"

import {
  type PastAssignmentData,
  getPastAssignments,
} from "../client-services/assignments"

const keyFor = (id: string) => `student-past-assignments/${id}` as const

interface Params {
  id: string
  fallbackData: PastAssignmentData
}

export function usePastAssignment({ id, fallbackData }: Params) {
  const key = keyFor(id)

  const swr = useSWR(key, () => getPastAssignments(id), {
    fallbackData,
    revalidateOnMount: true,
    keepPreviousData: true,
  })

  return {
    ...swr,
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
  return mutate<PastAssignmentData[]>(keyFor(id), data, opts)
}
