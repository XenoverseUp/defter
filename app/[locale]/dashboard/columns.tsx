"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVerticalIcon, ShapesIcon, SigmaIcon, Trash2Icon, UserRoundIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { deleteStudent, StudentData } from "@/lib/client-services/students";
import { Badge } from "@/components/ui/badge";

import { toast } from "sonner";
import { mutateStudents } from "@/lib/hooks/useStudents";
import { cn } from "@/lib/utils";
import { If } from "@/components/ui/if";

export function useColumns() {
  const t = useTranslations("Dashboard.table");

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "firstName",
      header: t("first-name"),
    },
    {
      accessorKey: "lastName",
      header: t("last-name"),
    },
    {
      accessorKey: "grade",
      header: t("grade"),
      cell: ({ cell }) => (
        <Badge
          variant="secondary"
          className={cn({
            "bg-blue-100 text-blue-500": cell.getValue() === "middle-school",
            "bg-orange-100 text-orange-600": cell.getValue() === "high-school",
          })}
        >
          <If condition={cell.getValue() === "middle-school"} renderItem={() => <ShapesIcon />} renderElse={() => <SigmaIcon />} />
          <If
            condition={cell.getValue() === "middle-school"}
            renderItem={() => t("middle-school")}
            renderElse={() => t("high-school")}
          />
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const student = row.original;

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <EllipsisVerticalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/student/${student.id}`}>
                    <UserRoundIcon />
                    Visit Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={async () => {
                    try {
                      await deleteStudent(student.id);
                      mutateStudents();
                      toast.success(t("actions.deleted-success", { count: 1 }));
                    } catch {
                      toast.error(t("actions.deleted-error"));
                    }
                  }}
                >
                  <Trash2Icon />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ] as ColumnDef<StudentData>[];
}
