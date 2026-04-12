"use client";

import { TDetailDrawerProps } from "@/types/elements";

import * as S from "@ui/sheet";

export const DetailDrawer = ({
  open,
  onOpenChange,
  title,
  description,
  children,
}: TDetailDrawerProps) => {
  return (
    <S.Sheet open={open} onOpenChange={onOpenChange}>
      <S.SheetContent
        side="right"
        className="w-full border-border/60 bg-card/95 backdrop-blur-2xl sm:max-w-2xl"
      >
        <S.SheetHeader>
          <S.SheetTitle>{title}</S.SheetTitle>
          {description ? (
            <S.SheetDescription>{description}</S.SheetDescription>
          ) : null}
        </S.SheetHeader>

        <div className="mt-6 space-y-4">{children}</div>
      </S.SheetContent>
    </S.Sheet>
  );
};
