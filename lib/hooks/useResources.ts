import useSWR, { mutate, type MutatorCallback, type MutatorOptions } from "swr"
import {
  getStudentResources,
  type StudentResourceData,
} from "../client-services/resources"
import type { UUID } from "crypto"
import { resourcesKeyFor } from "./keys"

interface Params {
  id: string | UUID
  fallbackData?: StudentResourceData[]
}

export function useStudentResources({ id, fallbackData }: Params) {
  const key = resourcesKeyFor(id)

  const swr = useSWR(key, () => getStudentResources(id), {
    fallbackData,
    revalidateOnMount: true,
    keepPreviousData: true,
    refreshWhenHidden: false,
    refreshInterval: 0,
  })

  return {
    ...swr,
    isStudentResourcesLoading: swr.isLoading,
    key,
  }
}

export function mutateStudentResources(
  id: string | UUID,
  data?:
    | StudentResourceData[]
    | Promise<StudentResourceData[]>
    | MutatorCallback<StudentResourceData[]>,
  opts?: MutatorOptions<StudentResourceData[]>,
) {
  return mutate<StudentResourceData[]>(resourcesKeyFor(id), data, opts)
}
