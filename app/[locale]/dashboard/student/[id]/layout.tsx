import { Link } from "@/i18n/navigation";
import { getUser } from "@/lib/auth";

import StudentProfile from "./student-profile";
import NavTab from "./nav-tab";
import { ReactNode } from "react";
import { UUID } from "crypto";
import { getLocale } from "next-intl/server";
import { ChevronLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStudentProfile } from "@/lib/actions/students";
import {redirect} from "next/navigation";

export default async function StudentLayout({ children, params }: { children: ReactNode; params: Promise<{ id: UUID }> }) {
  const { id } = await params;

  const user = await getUser();
  const locale = await getLocale();

  if (user === null) return redirect('/');

  const profile = await getStudentProfile(id, user.id);
  if (!profile) return redirect("/");

  return (
    <div className="pt-4">
      <Button asChild variant="link" className="pl-0! gap-1!">
        <Link href="/dashboard" prefetch>
          <ChevronLeftIcon strokeWidth={1.5} className="size-5" />
          Home
        </Link>
      </Button>
      <StudentProfile profile={profile} />
      <NavTab id={id} locale={locale} />
      <div>{children}</div>
    </div>
  );
}
