import { getStudentProfile } from "@/lib/actions/students";
import { getUser } from "@/lib/auth";
import { UUID } from "crypto";

export default async function StudentProfile({ params }: { params: Promise<{ id: UUID }> }) {
  const { id } = await params;
  const user = await getUser();

  if (user === null) return;

  const profile = await getStudentProfile(id, user.id);

  return (
    <section className="mt-16">
      <pre className="bg-accent p-4 border rounded-lg text-xs leading-relaxed w-fit">{JSON.stringify(profile, null, 4)}</pre>
    </section>
  );
}
