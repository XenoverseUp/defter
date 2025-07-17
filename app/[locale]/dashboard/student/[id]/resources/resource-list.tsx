"use client";

import { deleteStudentResource, StudentResourceData } from "@/lib/client-services/resources";
import { mutateStudentResources, useStudentResources } from "@/lib/hooks/useResources";
import type { UUID } from "crypto";
import { useParams } from "next/navigation";
import CreateResource from "./create-resource";
import { StudentData } from "@/lib/client-services/students";
import { subjectEnum } from "@/db/schema";
import { useTranslations } from "next-intl";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { If } from "@/components/ui/if";
import { toast } from "sonner";
import Empty from "./empty";

interface Props {
  initialData: StudentResourceData[];
  profile: Omit<StudentData, "createdAt" | "updatedAt">;
}

export default function ResourceList({ initialData, profile }: Props) {
  const { id } = useParams<{ id: string | UUID }>();

  const { data } = useStudentResources({
    fallbackData: initialData,
    id,
  });

  if (data.length === 0) return <Empty profile={profile} />;

  return (
    <div className="space-y-6">
      <CreateResource grade={profile.grade} studentId={profile.id} />

      <div className="space-y-6 mb-8">
        {subjectEnum.enumValues.map((subject) => {
          const resources = data.filter((item) => item.subject === subject);

          if (resources.length === 0) return null;
          return <SubjectLine key={`${profile.id}-${subject}`} {...{ subject, resources }} studentId={profile.id} />;
        })}
      </div>
    </div>
  );
}

interface SubjectLineProps {
  subject: (typeof subjectEnum.enumValues)[number];
  resources: StudentResourceData[];
  studentId: string;
}

function SubjectLine({ subject, resources, studentId }: SubjectLineProps) {
  const t = useTranslations("subject");

  return (
    <div>
      <h3 className="uppercase text-sm font-semibold text-muted-foreground mb-2">{t(subject)}</h3>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {resources.map((resource) => (
          <Resource key={resource.id} data={resource} studentId={studentId} />
        ))}
      </div>
    </div>
  );
}

function Resource({ data, studentId }: { data: StudentResourceData; studentId: string }) {
  const progress = (data.totalQuestions - data.questionsRemaining) / data.totalQuestions;
  const [deleteLoading, setDeleteLoading] = useState(false);

  const onDeleteClick = async () => {
    setDeleteLoading(true);

    try {
      await deleteStudentResource(data.id);
      await mutateStudentResources(studentId);
      toast.success("Successfully deleted resource.");
    } catch {
      setDeleteLoading(false);
      toast.error("Couldn't delete the resource.");
    }
  };

  return (
    <div className=" shadow-xs flex flex-col border rounded-lg divide-y relative overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2">
        <h4 className="font-semibold capitalize tracking-tight">{data.title}</h4>
        <p className="text-sm text-muted-foreground capitalize">{data.press}</p>
      </div>

      <div className="divide-x flex">
        <p className="text-xs grow text-muted-foreground px-4 py-2">Created at {new Date(data.createdAt).toDateString()}</p>
        {/* <button className="px-4 text-xs font-medium">Edit</button> */}
        <button onClick={onDeleteClick} className="px-4 text-xs font-medium flex items-center gap-1 hover:bg-accent transition">
          <Trash2 size={14} />
          <If condition={deleteLoading} renderItem={() => "Deleting..."} renderElse={() => "Delete"} />
        </button>
      </div>

      <div className="px-4 py-3 grow w-full flex items-center justify-between">
        <p className="text-sm font-medium">
          {data.questionsRemaining} questions remained out of {data.totalQuestions}.
        </p>
      </div>

      <div className="w-full flex items-center mt-auto h-5  divide-x">
        <div className="relative grow h-full overflow-hidden bg-white">
          <span
            className="absolute inset-0 bg-stone-900"
            style={{
              width: `${progress * 100}%`,
            }}
          />
        </div>
        <p className="shrink-0 w-12 block text-center font-medium text-xs text-foreground/80">{Math.round(progress * 100)}%</p>
      </div>
    </div>
  );
}
