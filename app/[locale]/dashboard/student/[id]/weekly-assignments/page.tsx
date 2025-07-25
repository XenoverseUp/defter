"use client"

import { useActiveAssignment } from "@/lib/hooks/useActiveAssignment"
import { useParams } from "next/navigation"

export default function WeeklyAssignments() {
  const { id } = useParams<{ id: string }>()

  const { data, isLoading } = useActiveAssignment({
    id,
  })

  if (isLoading) return "Loading"

  return <pre>{JSON.stringify(data, null, 2)}</pre>
}
