import { If } from "@/components/ui/if";
import { getStudentResources } from "@/lib/actions/resources";
import { getUserFromCookies } from "@/lib/auth";
import { UUID } from "crypto";
import Empty from "./empty";
import { getStudentProfile } from "@/lib/actions/students";

export default async function Resources({ params }: { params: Promise<{ id: UUID }> }) {
  const { id } = await params;

  const user = await getUserFromCookies();

  if (user === null) return;

  const profile = await getStudentProfile(id, user.id);
  const resources = await getStudentResources(id);

  return (
    <section>
      <If condition={resources.length === 0} renderItem={() => <Empty profile={profile} />} />
    </section>
  );
}
