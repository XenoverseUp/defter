import type { MutatorOptions, MutatorCallback } from "swr";
import useSWR, { mutate } from "swr";

import { getStudents, type StudentData } from "@/lib/client-services/students";

const KEY = "students" as const;

export function useStudents({ fallbackData }: { fallbackData: StudentData[] }) {
  const swr = useSWR(KEY, () => getStudents(), {
    fallbackData,
    revalidateOnMount: true,
    keepPreviousData: true,
  });

  return swr;
}

export function mutateStudents(
  data?: StudentData[] | Promise<StudentData[]> | MutatorCallback<StudentData[]>,
  opts?: MutatorOptions<StudentData[]>,
) {
  return mutate<StudentData[]>(KEY, data, opts);
}
