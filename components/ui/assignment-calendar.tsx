import { cn } from "@/lib/utils";
import type { UUID } from "crypto";
import { Button } from "./button";
import { CalendarDaysIcon, PlusIcon } from "lucide-react";
import { Dialog, DialogHeader, DialogTitle, DialogTrigger, DialogContent, DialogDescription } from "@/components/ui/dialog";

export type Assignment = {
  day: number;
  questionCount: number;
  resourceId: UUID | string;
};

interface Props {
  assignments?: Assignment[];
  setAssignments: (v: Assignment[]) => void;
}

export default function AssignmentCalendar({ assignments = [], setAssignments }: Props) {
  const currentWeekDates = Array.from(Array(7).keys()).map((idx) => {
    const d = new Date();
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + idx);
    return d;
  });

  return (
    <div className="w-full min-h-96 grid grid-cols-7 grid-rows-1 rounded-t-lg divide-x border border-b-0">
      {currentWeekDates.map((date, i) => (
        <DayView key={`day-view-${i}`} index={i} date={date} />
      ))}
    </div>
  );
}

function DayView({ index, date, items = [] }: { index: number; date: Date; items?: Assignment[] }) {
  const short = new Intl.DateTimeFormat("en-US", { weekday: "short" });
  const long = new Intl.DateTimeFormat("en-US", { day: "numeric", weekday: "long", year: "numeric" });

  if (index >= 7) return;

  const isToday = (() => {
    const today = new Date();
    return today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth() && today.getDate() === date.getDate();
  })();

  return (
    <div className="flex flex-col divide-y">
      <header
        className={cn("h-10 flex items-center justify-center text-sm text-muted-foreground", {
          "text-muted-foreground/50": [5, 6].includes(index),
        })}
      >
        <span>{short.format(date)}</span>
        <span
          className={cn("rounded-full size-6 flex items-center justify-center", {
            "bg-neutral-900/75 ml-1.5 text-white text-xs font-medium": isToday,
          })}
        >
          {date.getDate()}
        </span>
      </header>
      <div
        className={cn("flex flex-col gap-2 px-2 pt-2 h-full", {
          "bg-linear-180 from-muted/50 from-95% to-transparent": [5, 6].includes(index),
        })}
      >
        {items.map((item) => (
          <Entry key={item.resourceId} />
        ))}

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="shadow-none">
              <PlusIcon />
            </Button>
          </DialogTrigger>
          <DialogContent className="p-6 border-none!">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-1.5">
                <CalendarDaysIcon /> {long.format(date)}
              </DialogTitle>
              <DialogDescription>Create resource in student profile to track their progress.</DialogDescription>
            </DialogHeader>

            {/* <CreateResourceForm {...{ grade, studentId, setOpen }} /> */}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function Entry() {
  return (
    <div className="w-full h-16 overflow-hidden border border-orange-600/25 pl-4 py-2 rounded-md bg-orange-100 text-orange-900">
      <h3 className="text-sm font-medium">Asel</h3>
    </div>
  );
}
