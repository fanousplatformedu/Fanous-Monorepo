"use client";

import { TSocialItem } from "@/types/constant";
import { Button } from "@ui/button";
import { cn } from "@/lib/utils";

export const SocialLinks = ({ items }: { items: TSocialItem[] }) => {
  return (
    <div className="mt-6 flex items-center gap-2">
      {items.map((s) => {
        const Icon = s.icon;
        return (
          <Button
            key={s.label}
            asChild
            variant="soft"
            size="icon"
            className={cn(
              "rounded-2xl",
              "hover:translate-y-[-1px] transition-transform",
            )}
          >
            <a
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
            >
              <Icon className="h-4 w-4" />
            </a>
          </Button>
        );
      })}
    </div>
  );
};
