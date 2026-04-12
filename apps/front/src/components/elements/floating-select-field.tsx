"use client";

import { TFloatingSelectFieldProps } from "@/types/elements";
import { FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";

import * as S from "@ui/select";
import * as F from "@ui/form";

export const FloatingSelectField = <T extends FieldValues>({
  control,
  name,
  label,
  options,
  disabled,
}: TFloatingSelectFieldProps<T>) => {
  return (
    <F.FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <F.FormItem className="relative w-full min-w-0">
            <div className="relative w-full min-w-0">
              <S.Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <F.FormControl>
                  <S.SelectTrigger
                    className={cn(
                      "h-14 w-full min-w-0 rounded-2xl border border-border/60 bg-card/45 px-4 pb-2 pt-2 backdrop-blur-xl",
                      "focus:border-primary/30 focus:bg-card/65 focus:ring-0 focus-visible:ring-0",
                      "shadow-none focus-visible:shadow-[0_0_0_1px_rgba(59,130,246,0.08)]",
                      "dark:focus-visible:shadow-[0_0_0_1px_rgba(243,226,199,0.10)]",
                    )}
                  >
                    <S.SelectValue placeholder={label} />
                  </S.SelectTrigger>
                </F.FormControl>

                <S.SelectContent className="rounded-2xl border-border/60 bg-popover/95 backdrop-blur-xl">
                  {options.map((option) => (
                    <S.SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </S.SelectItem>
                  ))}
                </S.SelectContent>
              </S.Select>
            </div>

            <F.FormMessage className="mt-1 px-1 text-xs" />
          </F.FormItem>
        );
      }}
    />
  );
};
