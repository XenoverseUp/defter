"use client";

import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useColumns } from "./columns";
import { useTranslations } from "next-intl";
import { IconInput } from "@/components/ui/input";
import { LoaderIcon, RefreshCwIcon, Search, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Student, useStudent } from "@/lib/hooks/useStudents";
import { If } from "@/components/ui/if";
import { deleteStudents } from "@/lib/client-services/students";
import { toast } from "sonner";
import { useState } from "react";

interface DataTableProps {
  initialData: Student[];
}

export function DataTable({ initialData }: DataTableProps) {
  const columns = useColumns();
  const t = useTranslations("Dashboard.table");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { data = [], isLoading, mutate, isValidating } = useStudent({ fallbackData: initialData });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    enableRowSelection: true,
  });

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedCount = selectedRows.length;

  return (
    <div className="space-y-3">
      {/* Preamble */}
      <div className="flex items-center justify-between">
        <div className="flex grow items-center gap-4">
          <IconInput icon={Search} placeholder={t("actions.search")} className="max-w-sm shrink-0" />
        </div>

        <div className="flex items-center gap-4 justify-end">
          <If
            condition={selectedCount > 0}
            renderItem={() => (
              <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2Icon />
                    {t("actions.confirm.confirm", { count: selectedCount })}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-1.5 justify-center">
                      <Trash2Icon size={16} />
                      {t("actions.confirm.title")}
                    </AlertDialogTitle>
                    <AlertDialogDescription>{t("actions.confirm.description", { count: selectedCount })}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("actions.confirm.cancel")}</AlertDialogCancel>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deleteLoading}
                      onClick={async () => {
                        try {
                          setDeleteLoading(true);
                          const ids = selectedRows.map((row) => row.original.id);
                          await deleteStudents(ids);
                          mutate();
                          toast.success(t("actions.deleted-success", { count: ids.length }));
                          setDeleteDialogOpen(false);
                        } catch {
                          toast.error(t("actions.deleted-error"));
                        } finally {
                          setDeleteLoading(false);
                        }
                      }}
                    >
                      <If
                        condition={deleteLoading}
                        renderItem={() => (
                          <>
                            <LoaderIcon className="animate-spin" />
                            {t("actions.confirm.loading")}
                          </>
                        )}
                        renderElse={() => (
                          <>
                            <Trash2Icon />
                            {t("actions.confirm.confirm", { count: selectedCount })}
                          </>
                        )}
                      />
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          />
          <Button size="sm" variant="ghost">
            <RefreshCwIcon
              onClick={() => mutate()}
              className={cn("transition-transform", {
                "animate-spin opacity-50": isLoading || isValidating,
              })}
              strokeWidth={1.5}
            />
            Refresh
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
