import { cn } from "@/lib/utils";

type Assignment = {};

interface Props {
  assignments?: Assignment[];
}

export default function AssignmentCalendar({ assignments }: Props) {
  const currentWeekDates = Array.from(Array(7).keys()).map((idx) => {
    const d = new Date();
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + idx);
    return d;
  });

  return (
    <div className="w-full min-h-32 grid grid-cols-7 grid-rows-1 rounded-t-lg divide-x border border-b-0">
      {currentWeekDates.map((date, i) => (
        <DayView key={`day-view-${i}`} index={i} date={date} />
      ))}
    </div>
  );
}

function DayView({ index, date }: { index: number; date: Date }) {
  const { format } = new Intl.DateTimeFormat("en-US", { weekday: "short" });
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
        <span>{format(date)}</span>
        <span className={cn("rounded-full size-6 flex items-center justify-center", { "bg-sky-500 ml-1.5 text-white": isToday })}>
          {date.getDate()}
        </span>
      </header>
      <div className="flex flex-col gap-2 px-2 pt-2">
        <Entry />
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
