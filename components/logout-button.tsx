"use client";

import { authClient } from "@/lib/auth-client";

import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "@/i18n/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut();
    router.push("/");
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout <LogOut className="size-4" />
    </Button>
  );
}
