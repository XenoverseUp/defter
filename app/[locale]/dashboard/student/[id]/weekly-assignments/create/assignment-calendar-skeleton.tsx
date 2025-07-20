import { Skeleton } from "@/components/ui/skeleton";

export default function AssignmentCalendarSkeleton() {
  return (
    <div className="w-full rounded-t-lg overflow-hidden min-h-96 flex items-stretch gap-1">
      {new Array(7).fill(null).map((_, i) => (
        <Skeleton key={`assignment-calendar-skeleton-${i}`} className="grow" />
      ))}
    </div>
  );
}
