import { getUser } from "@/lib/auth";

import BoringAvatars from "boring-avatars";

export default async function AuthInfo() {
  const user = (await getUser())!;

  return (
    <div className="flex items-center transition gap-3 select-none rounded-full p-1 pr-3">
      <BoringAvatars name={user.email || "Can Durmus"} className="size-8" />
      <div className="flex flex-col items-start -space-y-0.5">
        <p className="text-sm font-medium">{user.name}</p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );
}
