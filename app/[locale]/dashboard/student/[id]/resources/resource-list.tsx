"use client";

import { deleteStudentResource, StudentResourceData } from "@/lib/client-services/resources";
import { mutateStudentResources, useStudentResources } from "@/lib/hooks/useResources";
import type { UUID } from "crypto";
import { useParams } from "next/navigation";
import CreateResource from "./create-resource";
import { StudentData } from "@/lib/client-services/students";
import { subjectEnum } from "@/db/schema";

import { InfoIcon, LoaderIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { If } from "@/components/ui/if";
import { toast } from "sonner";
import Empty from "./empty";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useTranslations } from "next-intl";

interface Props {
  initialData?: StudentResourceData[];
  profile: Omit<StudentData, "createdAt" | "updatedAt">;
}

export default function ResourceList({ initialData, profile }: Props) {
  const { id } = useParams<{ id: string | UUID }>();

  const { data } = useStudentResources({
    fallbackData: initialData,
    id,
  });

  if (!data) return "Loading..."; // !TODO: Skeleton

  if (data!.length === 0) return <Empty profile={profile} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <InfoIcon size={16} />
          The student currently has {data!.length} resource{data!.length === 1 ? "" : "s"}.
        </p>
        <CreateResource grade={profile.grade} studentId={profile.id} />
      </div>

      <div className="space-y-6 mb-8">
        {subjectEnum.enumValues.map((subject) => {
          const resources = data!.filter((item) => item.subject === subject);

          if (resources.length === 0) return null;
          return <SubjectGroup key={`${profile.id}-${subject}`} {...{ subject, resources }} studentId={profile.id} />;
        })}
      </div>
    </div>
  );
}

interface SubjectGroupProps {
  subject: (typeof subjectEnum.enumValues)[number];
  resources: StudentResourceData[];
  studentId: string;
}

function SubjectGroup({ subject, resources, studentId }: SubjectGroupProps) {
  const tSubject = useTranslations("subject");

  return (
    <div>
      <h3 className="uppercase text-sm font-semibold text-muted-foreground mb-2">{tSubject(subject)}</h3>
      <div className="flex flex-col rounded-lg border divide-y shadow-xs">
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
      await mutateStudentResources(studentId, async (current) => {
        await deleteStudentResource(data.id);
        return current?.filter((r) => r.id !== data.id);
      });

      toast.success("Successfully deleted resource.");
    } catch {
      setDeleteLoading(false);
      toast.error("Couldn't delete the resource.");
    }
  };

  return (
    <div className="px-4 pt-2 pb-2.5 space-y-1 relative">
      <div className="flex gap-2 items-center">
        <h4 className="font-semibold capitalize tracking-tight">{data.title}</h4>
        <p className=" text-sm text-muted-foreground capitalize">{data.press}</p>
      </div>
      <div className="grow w-full flex items-center gap-2">
        <p className="text-sm">
          <span className="font-medium">{data.questionsRemaining}</span> questions remained out of{" "}
          <span className="font-medium">{data.totalQuestions}</span>.
        </p>

        <Badge className="rounded-full">{Math.round(progress * 1000) / 10}%</Badge>
      </div>
      <Button onClick={onDeleteClick} size="icon" variant="secondary" className="ml-auto absolute right-5 top-1/2 -translate-y-1/2">
        <If condition={deleteLoading} renderItem={() => <LoaderIcon className="animate-spin" />} renderElse={() => <Trash2 />} />
      </Button>
    </div>
  );
}
