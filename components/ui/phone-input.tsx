import { ComponentProps, ComponentRef, forwardRef, ForwardRefExoticComponent, useEffect, useRef, useState } from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

type PhoneInputProps = Omit<ComponentProps<"input">, "onChange" | "value" | "ref"> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
  };

const PhoneInput: ForwardRefExoticComponent<PhoneInputProps> = forwardRef<ComponentRef<typeof RPNInput.default>, PhoneInputProps>(
  ({ className, onChange, value, ...props }, ref) => {
    const locale = useLocale();
    const [labels, setLabels] = useState<Record<string, string> | undefined>(undefined);

    useEffect(() => {
      if (locale === "tr") {
        import("react-phone-number-input/locale/tr.json").then((mod) => {
          setLabels(mod.default);
        });
      } else {
        setLabels(undefined);
      }
    }, [locale]);

    return (
      <RPNInput.default
        ref={ref}
        className={cn("flex", className)}
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={InputComponent}
        smartCaret
        value={value || undefined}
        limitMaxLength
        labels={labels}
        /**
         * Handles the onChange event.
         *
         * react-phone-number-input might trigger the onChange event as undefined
         * when a valid phone number is not entered. To prevent this,
         * the value is coerced to an empty string.
         *
         * @param {E164Number | undefined} value - The entered value
         */
        onChange={(value) => onChange?.(value || ("" as RPNInput.Value))}
        {...props}
      />
    );
  },
);
PhoneInput.displayName = "PhoneInput";

const InputComponent = forwardRef<HTMLInputElement, ComponentProps<"input">>(({ className, ...props }, ref) => (
  <Input className={cn("rounded-e-md rounded-s-none", className)} {...props} ref={ref} />
));
InputComponent.displayName = "InputComponent";

type CountryEntry = { label: string; value: RPNInput.Country | undefined };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  options: CountryEntry[];
  onChange: (country: RPNInput.Country) => void;
};

const CountrySelect = ({ disabled, value: selectedCountry, options: countryList, onChange }: CountrySelectProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("phone-input");

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="flex gap-2 w-26 rounded-e-none rounded-s-md border-r-0 px-3 focus:z-10"
          disabled={disabled}
        >
          <FlagComponent country={selectedCountry} countryName={selectedCountry} />
          <span className="text-muted-foreground text-xs ml-auto">{`+${selectedCountry ? RPNInput.getCountryCallingCode(selectedCountry) : "N/A"}`}</span>
          <ChevronsUpDown className={cn("-mr-2 size-4 opacity-50", disabled ? "hidden" : "opacity-100")} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            value={searchValue}
            onValueChange={(value) => {
              setSearchValue(value);
              setTimeout(() => {
                if (scrollAreaRef.current) {
                  const viewportElement = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
                  if (viewportElement) {
                    viewportElement.scrollTop = 0;
                  }
                }
              }, 0);
            }}
            placeholder={t("search-country-placeholder")}
          />
          <CommandList>
            <ScrollArea ref={scrollAreaRef} className="h-72">
              <CommandEmpty>{t("no-country-found")}</CommandEmpty>
              <CommandGroup>
                {countryList.map(({ value, label }) =>
                  value ? (
                    <CountrySelectOption
                      key={value}
                      country={value}
                      countryName={label}
                      selectedCountry={selectedCountry}
                      onChange={onChange}
                      onSelectComplete={() => setIsOpen(false)}
                    />
                  ) : null,
                )}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface CountrySelectOptionProps extends RPNInput.FlagProps {
  selectedCountry: RPNInput.Country;
  onChange: (country: RPNInput.Country) => void;
  onSelectComplete: () => void;
}

const CountrySelectOption = ({ country, countryName, selectedCountry, onChange, onSelectComplete }: CountrySelectOptionProps) => {
  const handleSelect = () => {
    onChange(country);
    onSelectComplete();
  };

  return (
    <CommandItem className="gap-2" onSelect={handleSelect}>
      <FlagComponent country={country} countryName={countryName} />
      <span className="flex-1 text-sm">{countryName}</span>
      <span className="text-sm text-foreground/50">{`+${RPNInput.getCountryCallingCode(country)}`}</span>
      <CheckIcon className={`ml-auto size-4 ${country === selectedCountry ? "opacity-100" : "opacity-0"}`} />
    </CommandItem>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex shrink-0 h-4 w-6 overflow-hidden rounded-[2px] bg-foreground/20 [&_svg:not([class*='size-'])]:size-full">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};

export { PhoneInput };
