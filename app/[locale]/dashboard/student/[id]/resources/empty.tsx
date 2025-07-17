import { NotebookIcon } from "lucide-react";
import CreateResource from "./create-resource";
import { StudentData } from "@/lib/client-services/students";

interface Props {
  profile: Omit<StudentData, "createdAt" | "updatedAt">;
}

export default function Empty({ profile }: Props) {
  return (
    <div className="w-full py-16 border rounded-lg border-dashed flex flex-col items-center justify-center">
      <NotebookIcon className="size-8 fill-sky-500/10 stroke-sky-900" strokeWidth={1.5} />
      <h2 className="text-sm font-medium mt-2 mb-6">No resources found.</h2>

      <CreateResource grade={profile.grade} studentId={profile.id} />
    </div>
  );
}
