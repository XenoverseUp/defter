"use client";

import AssignmentCalendar, { type Assignment } from "@/components/ui/assignment-calendar";
import { Button } from "@/components/ui/button";
import { NotebookIcon, PencilRulerIcon, PlusCircleIcon } from "lucide-react";
import { useState } from "react";

export default function CreateAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  return (
    <div className="py-6 flex flex-col gap-6">
      <header className="flex px-6 items-center gap-4">
        <div>
          <h2 className="text-lg font-medium flex items-center gap-1.5">
            <PencilRulerIcon className="size-5" strokeWidth={1.5} />
            Weekly Schedule
          </h2>
        </div>

        <p className="ml-auto text-sm font-medium">July 2025</p>
        <Button size="sm">
          <PlusCircleIcon /> Assign
        </Button>
      </header>

      <AssignmentCalendar {...{ assignments, setAssignments }} />
    </div>
  );
}
