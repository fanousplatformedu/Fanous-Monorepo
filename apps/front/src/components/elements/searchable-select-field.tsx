"use client";

import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui/command";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

import * as F from "@ui/form";

type TOption = { value: string; label: string };

// ─── Single-select (grade / classroom) ───────────────────────────────────────
type TSearchableSingleSelectProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  options: TOption[];
  placeholder?: string;
};

export function SearchableSingleSelectField<T extends FieldValues>({
  name,
  control,
  label,
  options,
  placeholder,
}: TSearchableSingleSelectProps<T>) {
  const [open, setOpen] = useState(false);

  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const selected = options.find((o) => o.value === field.value);

  return (
    <F.FormField
      name={name}
      control={control}
      render={() => (
        <F.FormItem className="relative w-full min-w-0">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "flex h-14 w-full items-center justify-between rounded-2xl border border-border/60 bg-card/45 px-4 text-sm backdrop-blur-xl transition",
                  "hover:bg-card/65 focus:outline-none focus:border-primary/30",
                  error && "border-destructive/60",
                )}
              >
                <span
                  className={cn(
                    "truncate",
                    !selected && "text-muted-foreground",
                  )}
                >
                  {selected ? selected.label : label}
                </span>
                <div className="flex shrink-0 items-center gap-1">
                  {selected ? (
                    <span
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.stopPropagation();
                          field.onChange("");
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        field.onChange("");
                      }}
                      className="rounded-full p-0.5 hover:text-destructive"
                    >
                      <X className="h-3.5 w-3.5" />
                    </span>
                  ) : null}
                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </div>
              </button>
            </PopoverTrigger>

            <PopoverContent
              className="p-0"
              style={{ width: "var(--radix-popover-trigger-width)" }}
            >
              <Command>
                <CommandInput placeholder={placeholder ?? label} />
                <CommandList>
                  <CommandEmpty className="py-4 text-xs text-muted-foreground">
                    No results found.
                  </CommandEmpty>
                  <CommandGroup>
                    {options.map((opt) => (
                      <CommandItem
                        key={opt.value}
                        value={opt.label}
                        onSelect={() => {
                          field.onChange(
                            field.value === opt.value ? "" : opt.value,
                          );
                          setOpen(false);
                        }}
                        className="rounded-xl"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 shrink-0",
                            field.value === opt.value
                              ? "opacity-100 text-primary"
                              : "opacity-0",
                          )}
                        />
                        {opt.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <F.FormMessage className="mt-1 px-1 text-xs" />
        </F.FormItem>
      )}
    />
  );
}

// ─── Multi-select (students) ──────────────────────────────────────────────────
type TSearchableMultiSelectProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  options: TOption[];
  placeholder?: string;
};

export function SearchableMultiSelectField<T extends FieldValues>({
  name,
  control,
  label,
  options,
  placeholder,
}: TSearchableMultiSelectProps<T>) {
  const [open, setOpen] = useState(false);

  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const selected: string[] = Array.isArray(field.value) ? field.value : [];

  const toggle = (value: string) => {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    field.onChange(next);
  };

  const removeOne = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    field.onChange(selected.filter((v) => v !== value));
  };

  const selectedLabels = selected
    .map((v) => options.find((o) => o.value === v)?.label)
    .filter(Boolean) as string[];

  return (
    <F.FormField
      name={name}
      control={control}
      render={() => (
        <F.FormItem className="relative w-full min-w-0">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "flex h-14 w-full items-center rounded-2xl border border-border/60 bg-card/45 px-4 text-sm backdrop-blur-xl transition",
                  "hover:bg-card/65 focus:outline-none focus:border-primary/30",
                  error && "border-destructive/60",
                )}
              >
                {/* scrollable chip row — no height growth */}
                <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto scrollbar-none">
                  {selectedLabels.length === 0 ? (
                    <span className="text-muted-foreground">{label}</span>
                  ) : (
                    selectedLabels.map((lbl, i) => (
                      <span
                        key={selected[i]}
                        className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                      >
                        {lbl}
                        <span
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              field.onChange(
                                selected.filter((v) => v !== selected[i]),
                              );
                            }
                          }}
                          onClick={(e) => removeOne(selected[i], e)}
                          className="rounded-full hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </span>
                      </span>
                    ))
                  )}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </button>
            </PopoverTrigger>

            <PopoverContent
              className="p-0"
              style={{ width: "var(--radix-popover-trigger-width)" }}
            >
              <Command>
                <CommandInput placeholder={placeholder ?? label} />
                <CommandList>
                  <CommandEmpty className="py-4 text-xs text-muted-foreground">
                    No results found.
                  </CommandEmpty>
                  <CommandGroup>
                    {options.map((opt) => {
                      const checked = selected.includes(opt.value);
                      return (
                        <CommandItem
                          key={opt.value}
                          value={opt.label}
                          onSelect={() => toggle(opt.value)}
                          className="rounded-xl"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 shrink-0",
                              checked
                                ? "opacity-100 text-primary"
                                : "opacity-0",
                            )}
                          />
                          {opt.label}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>

              {selected.length > 0 ? (
                <div className="border-t border-border/40 px-3 py-2">
                  <button
                    type="button"
                    onClick={() => field.onChange([])}
                    className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                  >
                    Clear all ({selected.length})
                  </button>
                </div>
              ) : null}
            </PopoverContent>
          </Popover>

          <F.FormMessage className="mt-1 px-1 text-xs" />
        </F.FormItem>
      )}
    />
  );
}
