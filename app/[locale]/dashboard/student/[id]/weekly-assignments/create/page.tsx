import {
  Calendar,
  CalendarCurrentDate,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarWeekView,
} from "@/components/ui/full-calendar";
import { ChevronLeft, ChevronRight, PencilRulerIcon } from "lucide-react";

export default function CreateAssignments() {
  return (
    <Calendar
      view="week"
      events={[
        {
          id: "1",
          start: new Date("2024-08-26T09:30:00Z"),
          end: new Date("2024-08-26T14:30:00Z"),
          title: "event A",
          color: "pink",
        },
        {
          id: "2",
          start: new Date("2024-08-26T10:00:00Z"),
          end: new Date("2024-08-26T10:30:00Z"),
          title: "event B",
          color: "blue",
        },
      ]}
    >
      <div className="py-6 flex flex-col">
        <div className="flex px-6 items-center gap-2 mb-6">
          <h2 className="text-lg font-medium flex items-center gap-1.5">
            <PencilRulerIcon className="size-5" strokeWidth={1.5} />
            Create Assignment
          </h2>

          <span className="flex-1" />

          <CalendarCurrentDate />

          <CalendarPrevTrigger>
            <ChevronLeft size={20} />
            <span className="sr-only">Previous</span>
          </CalendarPrevTrigger>

          <CalendarTodayTrigger>Today</CalendarTodayTrigger>

          <CalendarNextTrigger>
            <ChevronRight size={20} />
            <span className="sr-only">Next</span>
          </CalendarNextTrigger>
        </div>

        <div className="overflow-auto px-6 relative">
          <CalendarWeekView />
        </div>
      </div>
    </Calendar>
  );
}
