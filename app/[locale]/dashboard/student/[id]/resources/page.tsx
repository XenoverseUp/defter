import { getStudentResources } from "@/lib/actions/resources";
import { getUser } from "@/lib/auth";
import type { UUID } from "crypto";

import { getStudentProfile } from "@/lib/actions/students";
import ResourceList from "./resource-list";

export default async function Resources({ params }: { params: Promise<{ id: UUID }> }) {
  const { id } = await params;

  const user = await getUser();

  if (user === null) return;

  const profile = await getStudentProfile(id, user.id);
  const resources = await getStudentResources(id);

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
