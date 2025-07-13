import { Barrel } from "lucide-react";

import { LoginForm } from "./login-form";
import Image from "next/image";

import LocaleSwitcher from "@/components/ui/locale";
import { Link } from "@/i18n/navigation";

export default async function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <header className="flex justify-between w-full  gap-2">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-sky-500 shadow-xl text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Barrel className="size-4" />
            </div>
            Defter.
          </Link>
          <LocaleSwitcher />
        </header>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image src="/login.webp" alt="Image" fill className="object-cover" />
      </div>
    </div>
  );
}
