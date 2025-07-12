import { Button } from "@/components/ui/button";
import { GraduationCapIcon, PlusCircleIcon } from "lucide-react";

import { DataTable } from "./data-table";
import { getTranslations } from "next-intl/server";
import { getStudents } from "@/lib/actions/students";
import { getSession } from "@/lib/auth";
import { Link } from "@/i18n/navigation";

export default async function Dashboard() {
  const t = await getTranslations("Dashboard");
  const session = await getSession();
  const initialStudentData = await getStudents(session!.user.id);

  return (
    <section className="pt-8 pb-16 space-y-8">
      <header className="items-end justify-between flex">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <GraduationCapIcon size={20} />
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        <Button size="sm" variant="outline" asChild>
          <Link href="/dashboard/create">
            <PlusCircleIcon />
            {t("create")}
          </Link>
        </Button>
      </header>

      <div>
        <DataTable initialData={initialStudentData} />
      </div>
    </section>
  );
}
