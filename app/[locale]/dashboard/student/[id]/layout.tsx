import { Link, redirect } from "@/i18n/navigation";
import { getSession } from "@/lib/auth";

import StudentProfile from "./student-profile";
import NavTab from "./nav-tab";
import { ReactNode } from "react";
import { UUID } from "crypto";
import { getLocale } from "next-intl/server";
import { ChevronLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStudentProfile } from "@/lib/actions/students";

export default async function StudentLayout({ children, params }: { children: ReactNode; params: Promise<{ id: UUID }> }) {
  const { id } = await params;

  const session = await getSession();
  const locale = await getLocale();
  if (!session) return redirect({ href: "/", locale });

  const profile = await getStudentProfile(id, session?.user.id);
  if (!profile) return redirect({ href: "/dashboard", locale });

  return (
    <div className="pt-4">
      <Button asChild variant="link" className="pl-0! gap-1!">
        <Link href="/dashboard">
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
