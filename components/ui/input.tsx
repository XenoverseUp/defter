import * as React from "react";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "./button";

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

function IconInput({ className, type, icon: Icon, ...props }: { icon: LucideIcon } & React.ComponentProps<"input">) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 border border-input rounded-md w-full px-3 h-9 shadow-xs transition-[box-shadow]",
        "has-focus-visible:border-ring has-focus-visible:ring-ring/50 has-focus-visible:ring-[3px]",
        className,
      )}
    >
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

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, min = 0, max = Infinity, step = 1, value: controlledValue, onChange, onValueChange, ...props }, ref) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = React.useState<number>(Number(controlledValue) || 0);
    const value = isControlled ? Number(controlledValue) : internalValue;

    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const setInputRef = (el: HTMLInputElement | null) => {
      inputRef.current = el;
      if (typeof ref === "function") {
        ref(el);
      } else if (ref) {
        (ref as React.RefObject<HTMLInputElement | null>).current = el;
      }
    };

    const updateValue = (next: number) => {
      if (next < min || next > max) return;

      if (!isControlled) setInternalValue(next);

      onValueChange?.(next);

      if (onChange && inputRef.current) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
        nativeInputValueSetter?.call(inputRef.current, String(next));

        const event = new Event("input", { bubbles: true });
        inputRef.current.dispatchEvent(event);
      }
    };

    return (
      <div
        className={cn(
          "inline-flex h-9 w-full items-center overflow-hidden rounded-md border transition border-input shadow-xs",
          "disabled:opacity-50",
          "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-full rounded-none border-r"
          onClick={() => updateValue(value - step)}
          disabled={value <= min}
        >
          <MinusIcon size={16} />
        </Button>

        <Input
          ref={setInputRef}
          type="number"
          inputMode="numeric"
          className="h-full w-full outline-none ring-0! border-0 px-3 text-center tabular-nums"
          value={value}
          onChange={(e) => {
            const next = Number(e.target.value);
            if (!Number.isNaN(next)) updateValue(next);
          }}
          onClick={() => inputRef.current?.select()}
          onFocus={() => inputRef.current?.select()}
          {...props}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-full rounded-none border-l"
          onClick={() => updateValue(value + step)}
          disabled={value >= max}
        >
          <PlusIcon size={16} />
        </Button>
      </div>
    );
  },
);

NumberInput.displayName = "NumberInput";

export { Input, IconInput, NumberInput };
