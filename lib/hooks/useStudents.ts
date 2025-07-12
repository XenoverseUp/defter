import useSWR from "swr";

export type Student = {
  id: string;
  grade: "middle-school" | "high-school";
  firstName: string;
  lastName: string;
};

const fetcher = (url: string): Promise<Student[]> => fetch(url).then((res) => res.json());

export function useStudent({ fallbackData }: { fallbackData: any }) {
  const swr = useSWR("/api/students", fetcher, {
    fallbackData,
    revalidateOnMount: true,
    keepPreviousData: true,
  });

  return swr;
}
