"use client";

import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useColumns } from "./columns";
import { useTranslations } from "next-intl";
import { IconInput } from "@/components/ui/input";
import { RefreshCwIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Student, useStudent } from "@/lib/hooks/useStudents";

interface DataTableProps {
  initialData: Student[];
}

export function DataTable({ initialData }: DataTableProps) {
  const columns = useColumns();
  const t = useTranslations("Dashboard.table");

  const { data = [], isLoading, mutate, isValidating } = useStudent({ fallbackData: initialData });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-3">
      {/* Preamble */}
      <div className="flex items-center justify-between">
        <div className="flex grow items-center gap-4">
          <IconInput icon={Search} placeholder="Filter" className="max-w-sm shrink-0" />
        </div>

        <div className="flex items-center justify-end">
          <Button size="icon" variant="ghost">
            <RefreshCwIcon
              onClick={() => mutate()}
              className={cn("transition-transform", {
                "animate-spin opacity-50": isLoading || isValidating,
              })}
              strokeWidth={1.5}
            />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const student: Student = row.original;
                const isOptimistic = student.id.startsWith("temp-");

                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(isOptimistic && "opacity-50 pointer-events-none")}
                    title={isOptimistic ? "Saving..." : undefined}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t("no-result")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        {table.getRowCount()} {t("footer")}.
      </p>
    </div>
  );
}
