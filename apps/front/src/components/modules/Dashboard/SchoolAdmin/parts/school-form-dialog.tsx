"use client";

import { CreateValues, UpdateValues } from "@/lib/validation/super-admin";
import { useUpdateSchoolMutation } from "@/lib/redux/api";
import { useCreateSchoolMutation } from "@/lib/redux/api";
import { TSchoolFormDialogProps } from "@/types/elements";
import { updateSchoolSchema } from "@/lib/validation/super-admin";
import { createSchoolSchema } from "@/lib/validation/super-admin";
import { FloatingInputField } from "@elements/floating-input-field";
import { getApiErrorMessage } from "@/utils/function-helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@ui/button";
import { toast } from "sonner";

import * as D from "@ui/dialog";
import * as F from "@ui/form";

export const SchoolFormDialog = ({
  open,
  onOpenChange,
  initialValues,
}: TSchoolFormDialogProps) => {
  const isEdit = Boolean(initialValues);

  const [createSchool, { isLoading: isCreating }] = useCreateSchoolMutation();
  const [updateSchool, { isLoading: isUpdating }] = useUpdateSchoolMutation();

  const form = useForm<CreateValues | UpdateValues>({
    resolver: zodResolver(isEdit ? updateSchoolSchema : createSchoolSchema),
    defaultValues: isEdit
      ? {
          schoolId: initialValues?.id ?? "",
          name: initialValues?.name ?? "",
          code: initialValues?.code ?? "",
        }
      : {
          name: "",
          code: "",
        },
  });

  const isSubmitting = isCreating || isUpdating;

  const onSubmit = async (values: CreateValues | UpdateValues) => {
    try {
      if (isEdit) {
        const payload = values as UpdateValues;
        await updateSchool({
          schoolId: payload.schoolId,
          name: payload.name.trim(),
          code: payload.code?.trim() || undefined,
        }).unwrap();
        toast.success("School updated successfully");
      } else {
        const payload = values as CreateValues;
        await createSchool({
          name: payload.name.trim(),
          code: payload.code?.trim() || undefined,
        }).unwrap();
        toast.success("School created successfully");
      }
      onOpenChange(false);
      form.reset();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to reject request"));
    }
  };

  return (
    <D.Dialog open={open} onOpenChange={onOpenChange}>
      <D.DialogContent className="rounded-[1.75rem] border-border/60 bg-card/90 backdrop-blur-2xl sm:max-w-xl">
        <D.DialogHeader>
          <D.DialogTitle>
            {isEdit ? "Edit School" : "Create School"}
          </D.DialogTitle>
          <D.DialogDescription>
            {isEdit
              ? "Update school information."
              : "Create a new school tenant."}
          </D.DialogDescription>
        </D.DialogHeader>

        <F.Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {isEdit ? (
              <input
                type="hidden"
                value={(form.watch("schoolId") as string) || ""}
                readOnly
              />
            ) : null}

            <FloatingInputField
              label="School name"
              control={form.control}
              name={"name" as never}
            />

            <FloatingInputField
              label="School code"
              control={form.control}
              name={"code" as never}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="brandOutline"
                className="rounded-2xl"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={"brand"}
                className="rounded-2xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : isEdit ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </F.Form>
      </D.DialogContent>
    </D.Dialog>
  );
};
