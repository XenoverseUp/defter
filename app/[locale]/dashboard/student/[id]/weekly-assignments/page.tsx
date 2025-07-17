import { Link } from "@/i18n/navigation";
import type { UUID } from "crypto";

export default async function WeeklyAssignments({ params }: { params: Promise<{ id: UUID }> }) {
  const studentId = (await params).id;
  return <Link href={`/dashboard/student/${studentId}/weekly-assignments/create`}>Create</Link>;
}
