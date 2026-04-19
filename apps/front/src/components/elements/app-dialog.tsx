"use client";

import { TAppDialogActionsProps, TAppDialogProps } from "@/types/elements";
import { sizeClassMap } from "@/utils/constant";
import { Button } from "@ui/button";
import { cn } from "@/lib/utils";

import * as D from "@ui/dialog";

export const AppDialog = ({
  open,
  icon,
  title,
  footer,
  children,
  className,
  description,
  size = "md",
  onOpenChange,
  bodyClassName,
  preventClose = false,
  hideCloseButton = false,
}: TAppDialogProps) => {
  return (
    <D.Dialog open={open} onOpenChange={onOpenChange}>
      <D.DialogContent
        hideCloseButton={hideCloseButton}
        className={cn(
          "rounded-[1.75rem] border-border/60 bg-card/90 backdrop-blur-2xl",
          sizeClassMap[size],
          className,
        )}
        onEscapeKeyDown={(event) => {
          if (preventClose) event.preventDefault();
        }}
        onPointerDownOutside={(event) => {
          if (preventClose) event.preventDefault();
        }}
      >
        <D.DialogHeader>
          <D.DialogTitle className="flex items-center gap-2">
            {icon ? <span className="shrink-0">{icon}</span> : null}
            <span>{title}</span>
          </D.DialogTitle>

          {description ? (
            <D.DialogDescription>{description}</D.DialogDescription>
          ) : null}
        </D.DialogHeader>

        <div className={cn("space-y-4", bodyClassName)}>{children}</div>

        {footer ? <div className="flex justify-end gap-3">{footer}</div> : null}
      </D.DialogContent>
    </D.Dialog>
  );
};

export const AppDialogActions = ({
  form,
  onCancel,
  onConfirm,
  cancelText,
  confirmText,
  loadingText,
  isLoading = false,
  confirmType = "button",
  cancelDisabled = false,
  confirmDisabled = false,
  confirmVariant = "brand",
  cancelVariant = "brandSoft",
}: TAppDialogActionsProps) => {
  return (
    <>
      <Button
        type="button"
        onClick={onCancel}
        variant={cancelVariant}
        className="rounded-2xl"
        disabled={cancelDisabled || isLoading}
      >
        {cancelText}
      </Button>

      <Button
        type={confirmType}
        form={form}
        className="rounded-2xl"
        variant={confirmVariant}
        disabled={confirmDisabled || isLoading}
        onClick={confirmType === "button" ? onConfirm : undefined}
      >
        {isLoading ? (loadingText ?? confirmText) : confirmText}
      </Button>
    </>
  );
};
