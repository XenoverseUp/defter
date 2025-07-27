import { NotebookIcon } from "lucide-react"
import CreateResource from "./create-resource-form"
import { StudentData } from "@/lib/client-services/students"

interface Props {
  profile: Omit<StudentData, "createdAt" | "updatedAt">
}

export default function Empty({ profile }: Props) {
  return (
    <div className="w-full relative pt-20 pb-30 flex flex-col items-center justify-center">
      <div
        className="absolute inset-0 z-0 mask-b-from-60% mask-x-from-50%"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: "20px 30px",
        }}
      />

      <NotebookIcon
        className="size-8 fill-sky-500/10 stroke-sky-900 z-10"
        strokeWidth={1.5}
      />
      <h2 className="text-sm font-medium mt-2 mb-6 z-10">
        No resources found.
      </h2>

      <CreateResource grade={profile.grade} studentId={profile.id} />
    </div>
  )
}
