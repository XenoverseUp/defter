import { Button } from "@/components/ui/button";
import { GraduationCapIcon, PlusIcon } from "lucide-react";
import { columns, Payment } from "./columns";
import { DataTable } from "./data-table";

export default async function Dashboard() {
  const data = await getData();
  return (
    <section className="pt-8 space-y-8">
      <header className="items-end justify-between flex">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <GraduationCapIcon size={20} />
            Student List
          </h1>
          <p className="text-sm text-muted-foreground">Access and manage your students with Defter.</p>
        </div>

        <Button size="sm" variant="outline">
          <PlusIcon />
          Create New
        </Button>
      </header>

      <div>
        <DataTable columns={columns} data={data} />
      </div>
    </section>
  );
}

async function getData(): Promise<Payment[]> {
  return [
    {
      id: "728ed52f",
      assigned: false,
      firstName: "Can",
      lastName: "Durmus",
    },
    {
      id: "728ed52f",
      assigned: true,
      firstName: "Ismail Kayra",
      lastName: "Durmus",
    },
    {
      id: "728ed52f",
      assigned: true,
      firstName: "Omer",
      lastName: "Ozbey",
    },
    {
      id: "728ed52f",
      assigned: false,
      firstName: "Digdem",
      lastName: "Yildiz",
    },
  ];
}
