import type { MutatorOptions, MutatorCallback } from "swr";
import useSWR, { mutate } from "swr";

import { getStudents, type StudentData } from "../client-services/students";

const KEY = "students" as const;

const fetcher = async (): Promise<StudentData[]> => {
  return await getStudents();
};

export function useStudents({ fallbackData }: { fallbackData: StudentData[] }) {
  const swr = useSWR(KEY, fetcher, {
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
