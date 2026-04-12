"use client";

import { TFloatingPasswordFieldProps } from "@/types/elements";
import { FieldValues } from "react-hook-form";
import { useState } from "react";
import { Input } from "@ui/input";
import { cn } from "@/lib/utils";

import * as L from "lucide-react";
import * as F from "@ui/form";

export const FloatingPasswordField = <T extends FieldValues>({
  control,
  name,
  label,
}: TFloatingPasswordFieldProps<T>) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <F.FormField
      control={control}
      name={name}
      render={({ field }) => {
        const hasValue = String(field.value ?? "").length > 0;

        return (
          <F.FormItem className="relative">
            <div className="relative">
              <F.FormLabel
                className={cn(
                  "pointer-events-none absolute left-4 z-10 transition-all duration-200",
                  focused || hasValue
                    ? "top-2 text-xs text-primary"
                    : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground",
                )}
              >
                {label}
              </F.FormLabel>

              <F.FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    onFocus={() => setFocused(true)}
                    onBlur={() => {
                      setFocused(false);
                      field.onBlur();
                    }}
                    className={cn(
                      "h-14 rounded-2xl border border-border/60 bg-card/45 px-4 pb-2 pt-6 pr-12 backdrop-blur-xl",
                      "placeholder:text-transparent",
                      "focus:border-primary/30 focus:bg-card/65 focus:ring-0 focus-visible:ring-0",
                      "shadow-none focus-visible:shadow-[0_0_0_1px_rgba(59,130,246,0.08)] dark:focus-visible:shadow-[0_0_0_1px_rgba(243,226,199,0.10)]",
                    )}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted-foreground transition hover:bg-card/70 hover:text-foreground"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <L.EyeOff className="h-4 w-4" />
                    ) : (
                      <L.Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </F.FormControl>
            </div>

            <F.FormMessage className="mt-1 px-1 text-xs" />
          </F.FormItem>
        );
      }}
    />
  );
};
