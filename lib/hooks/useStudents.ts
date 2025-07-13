import { FormSchema } from "@/app/[locale]/dashboard/create/page";
import useSWR from "swr";

export type Student = {
  id: string;
} & FormSchema;

const fetcher = (url: string): Promise<Student[]> => fetch(url).then((res) => res.json());

export function useStudent({ fallbackData }: { fallbackData: Student[] }) {
  const swr = useSWR("/api/students", fetcher, {
    fallbackData,
    revalidateOnMount: true,
    keepPreviousData: true,
  });

  return swr;
}
