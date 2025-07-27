import { Button } from "@/components/ui/button"
import { If } from "@/components/ui/if"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Link } from "@/i18n/navigation"
import { usePastAssignments } from "@/lib/hooks/usePastAssignments"
import { HistoryIcon, PencilRulerIcon } from "lucide-react"
import { useParams } from "next/navigation"

export default function Empty() {
  const { id } = useParams<{ id: string }>()

  const { pastAssignments } = usePastAssignments({
    id,
  })

  return (
    <div className="w-full bg-background relative pt-20 pb-30 rounded-lg flex flex-col items-center justify-center">
      {/* Top Fade Grid Background */}
      <div
        className="absolute inset-0 z-0 mask-b-from-60% mask-x-from-50%"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: "20px 30px",
        }}
      />

      {/* <ChartGanttIcon className="size-8 stroke-sky-900" strokeWidth={1.5} /> */}
      <h2 className="text-sm z-10 font-medium mt-2 mb-6 flex items-center gap-1">
        No weekly assignment found.
      </h2>

      <div className="flex items-center gap-4 z-10">
        <Button size="sm" asChild>
          <Link href={`/dashboard/student/${id}/weekly-assignments/create`}>
            <PencilRulerIcon />
            Assign
          </Link>
        </Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="sm" variant="outline">
              <HistoryIcon />
              Assignment History
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-1.5">
                <HistoryIcon size={20} />
                Assignment History
              </SheetTitle>
              <SheetDescription>
                <If
                  condition={!!pastAssignments?.length}
                  renderItem={() =>
                    "There are no records about previous assignments."
                  }
                  renderElse={() =>
                    `${pastAssignments!.length} assignment records are found.`
                  }
                />
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
