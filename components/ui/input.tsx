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
  disabled?: boolean;
  format?: string;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      min = 0,
      max = Infinity,
      step = 1,
      value: controlledValue,
      onChange,
      onValueChange,
      disabled,
      format,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = React.useState<number>(Number(controlledValue) || 0);
    const [isFocused, setIsFocused] = React.useState(false);
    const value = isControlled ? Number(controlledValue) : internalValue;

    const displayValue = isFocused || !format ? value.toString() : format.replace("%d", value.toString());

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const inputValue = e.target.value;

      let next: number;
      if (format && !isFocused) {
        const escapedFormat = format.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&").replace("%d", "(\\d+)");
        const regex = new RegExp(`^${escapedFormat}$`);
        const match = inputValue.match(regex);
        next = match ? Number(match[1]) : Number(inputValue.replace(/[^0-9.-]/g, ""));
      } else {
        next = Number(inputValue.replace(/[^0-9.-]/g, ""));
      }

      if (!Number.isNaN(next)) {
        updateValue(next);
      }
    };

    const selectNumericPart = () => {
      if (disabled || !inputRef.current) return;

      const input = inputRef.current;
      input.select();
      if (format && !isFocused) {
        const formattedValue = format.replace("%d", value.toString());
        const numStr = value.toString();
        const start = formattedValue.indexOf(numStr);
        const end = start + numStr.length;
        input.setSelectionRange(start, end);
      }
    };

    return (
      <div
        aria-disabled={disabled}
        data-disabled={disabled}
        aria-invalid={ariaInvalid}
        className={cn(
          "inline-flex h-9 w-full min-w-0 items-center overflow-hidden rounded-md border bg-transparent shadow-xs transition-[color,box-shadow]",
          "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          'data-[disabled="true"]:pointer-events-none data-[disabled="true"]:cursor-not-allowed data-[disabled="true"]:opacity-50',
          className,
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-full rounded-none border-r"
          onClick={() => updateValue(value - step)}
          disabled={disabled || value <= min}
          tabIndex={disabled ? -1 : 0}
        >
          <MinusIcon size={16} />
        </Button>

        <Input
          ref={setInputRef}
          type="text"
          inputMode="numeric"
          className={cn(
            "h-full w-full outline-none ring-0! border-0 px-3 text-center tabular-nums",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          )}
          value={displayValue}
          disabled={disabled}
          onChange={handleInputChange}
          onClick={selectNumericPart}
          onFocus={() => {
            if (disabled) return;
            setIsFocused(true);
            setTimeout(selectNumericPart, 0);
          }}
          onBlur={() => {
            if (disabled) return;
            setIsFocused(false);
          }}
          tabIndex={disabled ? -1 : 0}
          aria-invalid={ariaInvalid}
          {...props}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-full rounded-none border-l"
          onClick={() => updateValue(value + step)}
          disabled={disabled || value >= max}
          tabIndex={disabled ? -1 : 0}
        >
          <PlusIcon size={16} />
        </Button>
      </div>
    );
  },
);

NumberInput.displayName = "NumberInput";

export { Input, IconInput, NumberInput };
