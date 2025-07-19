import useSWR, { mutate, type MutatorCallback, type MutatorOptions } from "swr";

import type { UUID } from "crypto";
import { getStudentProfile, type StudentData } from "../client-services/students";

const keyFor = (id: string) => `students-profiles/${id}` as const;

interface Params {
  id: string | UUID;
  fallbackData: StudentData;
}

export function useStudentProfile({ id, fallbackData }: Params) {
  const key = keyFor(id);

  const swr = useSWR(key, () => getStudentProfile(id), {
    fallbackData,
    revalidateOnMount: true,
    keepPreviousData: true,
  });

  return {
    ...swr,
    key,
  };
}

export function mutateStudentProfile(
  id: string | UUID,
  data?: StudentData[] | Promise<StudentData[]> | MutatorCallback<StudentData[]>,
  opts?: MutatorOptions<StudentData[]>,
) {
  return mutate<StudentData[]>(keyFor(id), data, opts);
}
