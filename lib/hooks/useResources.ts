import useSWR, { mutate, type MutatorCallback, type MutatorOptions } from "swr";
import { getStudentResources, type StudentResourceData } from "../client-services/resources";
import type { UUID } from "crypto";

const keyFor = (id: string) => `students-resources/${id}` as const;

interface Params {
  id: string | UUID;
  fallbackData: StudentResourceData[];
}

export function useStudentResources({ id, fallbackData }: Params) {
  const key = keyFor(id);

  const swr = useSWR(key, () => getStudentResources(id), {
    fallbackData,
    revalidateOnMount: true,
    keepPreviousData: true,
  });

  return {
    ...swr,
    key,
  };
}

export function mutateStudentResources(
  id: string | UUID,
  data?: StudentResourceData[] | Promise<StudentResourceData[]> | MutatorCallback<StudentResourceData[]>,
  opts?: MutatorOptions<StudentResourceData[]>,
) {
  return mutate<StudentResourceData[]>(keyFor(id), data, opts);
}
