import AuthInfo from "@/components/layout/auth-info";
import { LogoutButton } from "@/components/layout/logout-button";

import { Link } from "@/i18n/navigation";
import { getUserFromCookies } from "@/lib/auth";
import { Barrel } from "lucide-react";
import { ReactNode } from "react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getUserFromCookies();

  if (!user) return;

  return (
    <div className="w-full max-w-6xl mx-auto px-6 md:px-8">
      <header className="h-16 border-b border-dashed flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <div className="bg-sky-500 text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Barrel className="size-4" />
          </div>
          Defter.
        </Link>

        <div className="flex items-center gap-1">
          <AuthInfo {...{ user }} />
          <div className="w-px h-4 bg-border"></div>
          <LogoutButton />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
