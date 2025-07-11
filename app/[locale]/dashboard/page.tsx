import { Button } from "@/components/ui/button";
import { GraduationCapIcon, PlusIcon } from "lucide-react";
import { Payment } from "./columns";
import { DataTable } from "./data-table";
import { getTranslations } from "next-intl/server";

export default async function Dashboard() {
  const data = await getData();
  const t = await getTranslations("Dashboard");

  return (
    <section className="pt-8 space-y-8">
      <header className="items-end justify-between flex">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <GraduationCapIcon size={20} />
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        <Button size="sm" variant="outline">
          <PlusIcon />
          {t("create")}
        </Button>
      </header>

      <div>
        <DataTable data={data} />
      </div>
    </section>
  );
}

async function getData(): Promise<Payment[]> {
  return [
    {
      id: "728ed52f",
      grade: "high-school",
      firstName: "Can",
      lastName: "Durmus",
    },
    {
      id: "728ed52f",
      grade: "middle-school",
      firstName: "Ismail Kayra",
      lastName: "Durmus",
    },
    {
      id: "728ed52f",
      grade: "high-school",
      firstName: "Omer",
      lastName: "Ozbey",
    },
    {
      id: "728ed52f",
      grade: "middle-school",
      firstName: "Digdem",
      lastName: "Yildiz",
    },
  ];
}
