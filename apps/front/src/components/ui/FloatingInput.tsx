"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FloatingInput = forwardRef<HTMLInputElement, Props>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          ref={ref}
          placeholder=" "
          className={cn(
            `
            peer
            w-full
            bg-transparent
            border-0
            border-b-2 border-white/70
            text-white
            py-3
            outline-none
            transition-all duration-300
            focus:border-blue-400
          `,
            error && "border-red-400 focus:border-red-400",
            className,
          )}
          {...props}
        />

        <label
          className={cn(
            `
            absolute left-0
            top-3
            text-white/80
            transition-all duration-300 ease-in-out
            pointer-events-none

            /* حالت اولیه (مثل placeholder) */
            peer-placeholder-shown:top-3
            peer-placeholder-shown:text-base
            peer-placeholder-shown:text-white/80

            /* وقتی فوکوس شود */
            peer-focus:-top-4
            peer-focus:text-xs
            peer-focus:text-blue-400

            /* وقتی مقدار دارد */
            peer-not-placeholder-shown:-top-4
            peer-not-placeholder-shown:text-xs
          `,
            error && "text-red-400 peer-focus:text-red-400",
          )}
        >
          {label}
        </label>

        {error && (
          <p className="text-red-400 text-xs mt-2 animate-pulse">{error}</p>
        )}
      </div>
    );
  },
);

FloatingInput.displayName = "FloatingInput";

export default FloatingInput;
