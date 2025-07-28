import { Button } from "@/components/ui/button"
import { If } from "@/components/ui/if"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { usePastAssignments } from "@/lib/hooks/usePastAssignments"
import { HistoryIcon } from "lucide-react"
import { useParams } from "next/navigation"

export default function AssignmentHistory() {
  const { id } = useParams<{ id: string }>()
  const { pastAssignments } = usePastAssignments({ id })

  return (
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
  )
}
