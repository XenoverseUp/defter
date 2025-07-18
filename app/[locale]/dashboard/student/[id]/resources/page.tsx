import { getStudentResources } from "@/lib/actions/resources";
import { getUser } from "@/lib/auth";
import type { UUID } from "crypto";

import { getStudentProfile } from "@/lib/actions/students";
import ResourceList from "./resource-list";

export default async function Resources({ params }: { params: Promise<{ id: UUID }> }) {
  const { id: studentId } = await params;

  const user = await getUser();

  if (user === null) return;

  const [profile, resources] = await Promise.all([getStudentProfile(studentId, user.id), getStudentResources(studentId)]);

  return (
    <section>
      <ResourceList
        initialData={resources.map((resource) => ({
          ...resource,
          createdAt: resource.createdAt.toISOString(),
          updatedAt: resource.updatedAt.toISOString(),
        }))}
        profile={profile}
      />
    </section>
  );
}
