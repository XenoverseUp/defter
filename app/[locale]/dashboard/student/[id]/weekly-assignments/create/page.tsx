import AssignmentCalendar from "@/components/ui/assignment-calendar";
import { Button } from "@/components/ui/button";
import { PencilRulerIcon, PlusCircleIcon } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Calendar, CalendarCurrentDate, CalendarWeekView } from "@/components/ui/full-calendar";
// import { PencilRulerIcon, PlusCircleIcon } from "lucide-react";

export default function CreateAssignments() {
  return (
    <>
      <div className="py-6 flex flex-col">
        <header className="flex px-6 items-center gap-4 mb-6">
          <div>
            <h2 className="text-lg font-medium flex items-center gap-1.5">
              <PencilRulerIcon className="size-5" strokeWidth={1.5} />
              Weekly Schedule
            </h2>
          </div>

          <p className="ml-auto text-sm font-medium">July 2025</p>
          <Button size="sm" variant="secondary">
            <PlusCircleIcon />
            Create Assignment
          </Button>
        </header>

        <div className="overflow-auto relative">
          <AssignmentCalendar />
        </div>
      </div>
    </>
  );
}
