import AuthInfo from "@/components/layout/auth-info";
import { LogoutButton } from "@/components/layout/logout-button";
import { Skeleton } from "@/components/ui/skeleton";

import { Link } from "@/i18n/navigation";

import { Barrel } from "lucide-react";
import { ReactNode, Suspense } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
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
          <Suspense
            fallback={
              <div className="flex items-center gap-3 select-none rounded-full p-1 pr-3">
                <Skeleton className="size-8 rounded-full border" />
                <div className="flex flex-col items-start space-y-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            }
          >
            <AuthInfo />
          </Suspense>
          <div className="w-px h-4 bg-border"></div>
          <LogoutButton />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
