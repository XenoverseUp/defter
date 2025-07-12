import { getSession } from "@/lib/auth";
import BoringAvatars from "boring-avatars";

export default async function AuthInfo() {
  const session = await getSession();

  return (
    <div className="flex items-center transition gap-3 select-none rounded-full p-1 pr-3">
      <BoringAvatars name={session?.user.email || "Can Durmus"} className="size-8" />
      <div className="flex flex-col items-start -space-y-0.5">
        <p className="text-sm font-medium">{session?.user.name}</p>
        <p className="text-xs text-muted-foreground">{session?.user.email}</p>
      </div>
    </div>
  );
}
