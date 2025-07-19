import { cn, DateUtils } from "@/lib/utils";
import { useStudentResources } from "@/lib/hooks/useResources";
import { useParams } from "next/navigation";
import { ReactNode, useContext } from "react";
import { Assignment, AssignmentContext } from "./page";
import CreateAssignmentForm from "./create-assignment-form";
import { If } from "@/components/ui/if";

export default function AssignmentCalendar() {
  const { id } = useParams<{ id: string }>();
  const { assignments } = useContext(AssignmentContext);

  const { isLoading, data } = useStudentResources({ id });

  if (isLoading) return "Loading...";
  const resources = data!;

  return (
    <div className="w-full min-h-96 grid grid-cols-7 grid-rows-1 rounded-t-lg divide-x border border-b-0">
      {DateUtils.getCurrentWeekdates().map((date, i) => (
        <DayView key={`day-view-${i}`} index={i} date={date} items={assignments.filter(({ day }) => day === i)}>
          <If
            condition={
              !!resources.filter(
                (resource) => resource.questionsRemaining > 0 && !assignments.map((a) => a.resourceId).includes(resource.id),
              ).length
            }
            renderItem={() => (
              <CreateAssignmentForm title={DateUtils.format(date, { day: "numeric", weekday: "long", year: "numeric" })} day={i} />
            )}
          />
        </DayView>
      ))}
    </div>
  );
}

function DayView({ index, date, items = [], children }: { index: number; date: Date; items?: Assignment[]; children?: ReactNode }) {
  const { id } = useParams<{ id: string }>();
  const { data } = useStudentResources({ id });
  const resources = data!;

  if (index >= 7) return;

  return (
    <div className="flex flex-col divide-y">
      <header
        className={cn("h-10 flex items-center justify-center text-sm text-muted-foreground", {
          "text-muted-foreground/50": [5, 6].includes(index),
        })}
      >
        <span>{DateUtils.format(date, { weekday: "short" })}</span>
        <span
          className={cn("rounded-full size-6 flex items-center justify-center", {
            "bg-neutral-900/75 ml-1.5 text-white text-xs font-medium": DateUtils.isToday(date),
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

        {children}
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
