"use client";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { UUID } from "crypto";
import { BlocksIcon, ChartGanttIcon, NotebookIcon, UserRoundCogIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

function stripLocale(path: string): string {
  const segments = path.split("/");
  if (segments[1]?.length === 2) {
    return "/" + segments.slice(2).join("/");
  }
  return path;
}

type Tab = {
  label: string;
  href: string;
  icon: LucideIcon;
};

interface Props {
  locale: string;
  id: UUID;
}

export default function NavTab({ id, locale }: Props) {
  const rawPathname = usePathname();
  const pathname = stripLocale(rawPathname);

  const basePath = `/dashboard/student/${id}`;

  const tabs: Tab[] = [
    { label: "Overview", href: `${basePath}`, icon: BlocksIcon },
    { label: "Resources", href: `${basePath}/resources`, icon: NotebookIcon },
    { label: "Weekly Assignments", href: `${basePath}/weekly-assignments`, icon: ChartGanttIcon },
    { label: "Bio", href: `${basePath}/bio`, icon: UserRoundCogIcon },
  ];

  return (
    <div className="flex gap-5 border-b mb-6 pl-4 pr-2">
      {tabs.map((tab, index) => {
        const href = stripLocale(tab.href);

        const isActive = index === 0 ? pathname === href : pathname === href || pathname.startsWith(href + "/");
        const Icon = tab.icon;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            locale={locale}
            prefetch
            className={cn(
              "pb-2 px-0.5 border-b-2 text-sm transition-colors flex items-center gap-1.5",
              isActive ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon size={16} strokeWidth={1.5} />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
