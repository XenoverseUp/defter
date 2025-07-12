import * as React from "react";

import { cn } from "@/lib/utils";
import type { Icon as LucideIcon } from "lucide-react";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

function IconInput({ className, type, icon: Icon, ...props }: { icon: typeof LucideIcon } & React.ComponentProps<"input">) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 border border-input rounded-md w-full px-3 h-9 shadow-xs transition-[box-shadow]",
        "has-focus-visible:border-ring has-focus-visible:ring-ring/50 has-focus-visible:ring-[3px]",
        className,
      )}
    >
      {/* @ts-expect-error type mismatch */}
      <Icon size={16} />
      <input
        type={type}
        data-slot="input"
        className={cn(
          "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex w-full min-w-0 bg-transparent text-base transition-colors outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        )}
        {...props}
      />
    </div>
  );
}

export { Input, IconInput };
