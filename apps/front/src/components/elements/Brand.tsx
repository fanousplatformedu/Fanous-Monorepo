"use client";

import { TBrandProps } from "@/types/elements";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/utils";
import logo from "../../../public/assets/images/IMG_20260623_150009_493.jpg"
import Link from "next/link";
import Image from "next/image";

export const Brand = ({ href = "/", size = "md" }: TBrandProps) => {
  const { t } = useI18n();

  const box =
    size === "md" ? "h-12 w-12 rounded-xl text-lg" : "h-10 w-10 rounded-2xl";
  const text = size === "md" ? "text-[10px] sm:text-xs" : "text-xs";

  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-2.5 transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl",
      )}
    >
      <div
        className={cn(
          box,
          "flex items-center justify-center font-bold shadow-sm",
          "text-primary-foreground",
          "bg-[linear-gradient(135deg,rgba(59,130,246,1),rgba(147,197,253,1))]",
          "dark:bg-[linear-gradient(135deg,rgba(214,170,110,1),rgba(241,230,214,1))]",
          "transition-transform group-hover:scale-105 rounded-full",
        )}
      >
        <Image alt="logo" width={60} height={60} className="rounded-full" src={logo} />
      </div>

      <div className="flex flex-col leading-tight">
        <span className="font-semibold tracking-tight text-foreground">
          {t("app.name")}
          <span className="ml-1.5 text-xs font-medium text-muted-foreground">
            {t("app.tag")}
          </span>
        </span>

        <span className={cn(text, "text-muted-foreground/90 hidden sm:block")}>
          {t("app.subtitle")}
        </span>
      </div>
    </Link>
  );
};
