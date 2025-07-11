"use client";

import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(/^\/(en|tr)/, `/${newLocale}`);
    router.push(newPath);
    router.refresh();
  };

  const locale = useLocale();

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        className={cn({
          "font-semibold": locale === "en",
        })}
        onClick={() => switchLocale("en")}
      >
        EN
      </button>
      <div className="h-4 w-px bg-border"></div>
      <button
        className={cn({
          "font-semibold": locale === "tr",
        })}
        onClick={() => switchLocale("tr")}
      >
        TR
      </button>
    </div>
  );
}
