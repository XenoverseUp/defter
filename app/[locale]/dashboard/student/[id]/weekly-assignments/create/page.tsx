"use client";

import AssignmentCalendar from "@/app/[locale]/dashboard/student/[id]/weekly-assignments/create/assignment-calendar";
import { Button } from "@/components/ui/button";
import type { UUID } from "crypto";
import { PlusCircleIcon } from "lucide-react";
import { createContext, Dispatch, SetStateAction, useState } from "react";

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
        <Button size="sm">
          <PlusCircleIcon /> Assign
        </Button>
      </header>

      <AssignmentContext.Provider value={{ assignments, setAssignments }}>
        <AssignmentCalendar />
      </AssignmentContext.Provider>
    </div>
  );
}

export { type Assignment, AssignmentContext };
export default CreateAssignments;
