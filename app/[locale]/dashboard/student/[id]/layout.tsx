import { Link } from "@/i18n/navigation"
import { getUser } from "@/lib/auth"

import StudentProfile from "./student-profile"
import NavTab from "./nav-tab"
import { ReactNode } from "react"
import { UUID } from "crypto"
import { getLocale } from "next-intl/server"
import { ChevronLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getStudentProfile } from "@/lib/actions/students"
import { redirect } from "next/navigation"
import { getStudentResources } from "@/lib/actions/resources"

import SWRProvider from "@/components/layout/swr-provider"
import {
  activeAssignmentKeyFor,
  pastAssignmentKeyFor,
  profileKeyFor,
  resourcesKeyFor,
} from "@/lib/hooks/keys"
import {
  getActiveAssignment,
  getPastAssignments,
} from "@/lib/actions/assignments"

export default async function StudentLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ id: UUID }>
}) {
  const { id } = await params

  const user = await getUser()
  const locale = await getLocale()

  if (user === null) return redirect("/")

  const [profile, resources, activeAssignment, pastAssignments] =
    await Promise.all([
      getStudentProfile(id, user.id),
      getStudentResources(id, user.id),
      getActiveAssignment(id, user.id),
      getPastAssignments(id, user.id),
    ])
  if (!profile) return redirect("/")

  const fallback = {
    [resourcesKeyFor(id)]: resources.map((resource) => ({
      ...resource,
      createdAt: resource.createdAt.toISOString(),
      updatedAt: resource.updatedAt.toISOString(),
    })),
    [profileKeyFor(id)]: {
      ...profile,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    },
    [activeAssignmentKeyFor(id)]: activeAssignment,
    [pastAssignmentKeyFor(id)]: pastAssignments.map((assignment) => ({
      ...assignment,
      startsOn: assignment.startsOn.toISOString(),
    })),
  }

  return (
    <SWRProvider fallback={fallback}>
      <div className="pt-4">
        <Button asChild variant="link" className="pl-0! gap-1!">
          <Link href="/dashboard" prefetch>
            <ChevronLeftIcon strokeWidth={1.5} className="size-5" />
            Home
          </Link>
        </Button>
        <StudentProfile />
        <NavTab id={id} locale={locale} />
        <div>{children}</div>
      </div>
    </SWRProvider>
  )
}
