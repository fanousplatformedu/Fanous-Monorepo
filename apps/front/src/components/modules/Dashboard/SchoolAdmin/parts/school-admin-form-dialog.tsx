"use client";

import { useCreateSchoolAdminMutation, useSchoolsQuery } from "@/lib/redux/api";
import { TSchoolAdminFormDialogProps } from "@/types/elements";
import {
  createSchoolAdminSchema,
  Values,
} from "@/lib/validation/super-admin-schemas";
import { FloatingSelectField } from "@elements/floating-select-field";
import { getApiErrorMessage } from "@/utils/function-helper";
import { FloatingInputField } from "@elements/floating-input-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@ui/button";
import { toast } from "sonner";

import * as D from "@ui/dialog";
import * as F from "@ui/form";

export const SchoolAdminFormDialog = ({
  open,
  onOpenChange,
}: TSchoolAdminFormDialogProps) => {
  const [createSchoolAdmin, { isLoading }] = useCreateSchoolAdminMutation();

  const { data: schoolsData } = useSchoolsQuery({
    take: 100,
    skip: 0,
  });

  const schoolOptions =
    schoolsData?.items.map((item) => ({
      value: item.id,
      label: `${item.name}${item.code ? ` (${item.code})` : ""}`,
    })) ?? [];

  const form = useForm<Values>({
    resolver: zodResolver(createSchoolAdminSchema),
    defaultValues: {
      schoolId: "",
      adminEmail: "",
      adminFullName: "",
    },
  });

  const onSubmit = async (values: Values) => {
    try {
      const res = await createSchoolAdmin({
        schoolId: values.schoolId,
        adminEmail: values.adminEmail.trim().toLowerCase(),
        adminFullName: values.adminFullName?.trim() || undefined,
      }).unwrap();
      toast.success(res.message);
      if (res.tempPassword) toast.info(`Temp password: ${res.tempPassword}`);
      onOpenChange(false);
      form.reset();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to approve request"));
    }
  };

  return (
    <D.Dialog open={open} onOpenChange={onOpenChange}>
      <D.DialogContent className="rounded-[1.75rem] border-border/60 bg-card/90 backdrop-blur-2xl sm:max-w-xl">
        <D.DialogHeader>
          <D.DialogTitle>Create School Admin</D.DialogTitle>
          <D.DialogDescription>
            Create a new admin user for a selected school.
          </D.DialogDescription>
        </D.DialogHeader>

        <F.Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FloatingSelectField
              label="School"
              name="schoolId"
              control={form.control}
              options={schoolOptions}
            />

            <FloatingInputField
              type="email"
              name="adminEmail"
              label="Admin email"
              control={form.control}
            />

            <FloatingInputField
              name="adminFullName"
              control={form.control}
              label="Admin full name"
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="brandChip"
                className="rounded-2xl"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={"brand"}
                disabled={isLoading}
                className="rounded-2xl"
              >
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </F.Form>
      </D.DialogContent>
    </D.Dialog>
  );
};
