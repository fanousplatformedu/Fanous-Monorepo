"use client";

import { TFormData, TPhoneStep } from "@/types/modules";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";
import { cn } from "@/lib/utils";

import FloatingInput from "@ui/FloatingInput";

const PhoneStep = ({ onContinue, onBack }: TPhoneStep) => {
  const { t, dir } = useI18n();
  const [loading, setLoading] = useState(false);

  const form = useForm<TFormData>({
    defaultValues: { phone: "" },
    mode: "onChange",
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = form;

  const onSubmit = async (data: TFormData) => {
    if (!isValid) return;

    setLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 1200));
      onContinue(data.phone);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* ================== Title ================== */}
      <h2 className="text-2xl font-semibold text-center mb-10 text-white transition-all duration-300">
        {t("auth.enterMobile")}
      </h2>

      {/* ================== Form ================== */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-10 w-[80%]"
        dir={dir}
      >
        <FloatingInput
          type="tel"
          label={t("auth.mobileLabel")}
          error={errors.phone?.message}
          inputMode="numeric"
          {...register("phone", {
            required: t("auth.mobileRequired"),
            pattern: {
              value: /^[0-9]{10,15}$/,
              message: t("auth.mobileInvalid"),
            },
          })}
        />

        <Button
          type="submit"
          variant="brand"
          disabled={!isValid || loading}
          className={cn(
            "w-full transition-all duration-300",
            "hover:scale-[1.02]",
            "active:scale-[0.98]",
            loading && "opacity-80 cursor-not-allowed",
          )}
        >
          {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
          {t("auth.continue")}
        </Button>
      </form>

      {/* ================== Back Button ================== */}
      <button
        type="button"
        onClick={onBack}
        className={cn(
          "mt-6 text-sm transition-all duration-300",
          "text-white/60 hover:text-white",
          "hover:underline underline-offset-4",
        )}
      >
        {dir === "rtl" ? "→" : "←"} {t("auth.backToMethod")}
      </button>
    </div>
  );
};

export default PhoneStep;
