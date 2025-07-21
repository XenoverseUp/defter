"use client";

import AssignmentCalendar from "@/app/[locale]/dashboard/student/[id]/weekly-assignments/create/assignment-calendar";
import { Button } from "@/components/ui/button";
import { If } from "@/components/ui/if";
import type { UUID } from "crypto";
import { PlusCircleIcon } from "lucide-react";
import { createContext, Dispatch, SetStateAction, useMemo, useState } from "react";

type Assignment = {
  day: number;
  questionCount: number;
  resourceId: UUID | string;
};

const AssignmentContext = createContext<{
  assignments: Assignment[];
  setAssignments: Dispatch<SetStateAction<Assignment[]>>;
}>({
  assignments: [],
  setAssignments: () => {},
});

function CreateAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const totalQuestions = useMemo(
    () => assignments.map(({ questionCount }) => questionCount).reduce((a, b) => a + b, 0),
    [assignments],
  );

  return (
    <div className="py-6 flex flex-col gap-6">
      <header className="flex px-6 items-center gap-4">
        <div>
          <h2 className="text-lg font-medium flex items-center gap-1.5">
            {/* <PencilRulerIcon className="size-5" strokeWidth={1.5} /> */}
            Weekly Schedule
          </h2>
        </div>

        <p className="ml-auto text-sm font-medium">July 2025</p>
      </header>

      <AssignmentContext.Provider value={{ assignments, setAssignments }}>
        <AssignmentCalendar />
      </AssignmentContext.Provider>

      <div className="flex justify-end items-center gap-4 w-full">
        <If
          condition={totalQuestions > 0}
          renderItem={() => (
            <div>
              <p className="text-xs text-muted-foreground">{totalQuestions} questions were planned for this week.</p>
            </div>
          )}
        />
        <Button variant="outline">
          <PlusCircleIcon /> Assign
        </Button>
      </div>
    </div>
  );
}

export { type Assignment, AssignmentContext };
export default CreateAssignments;
