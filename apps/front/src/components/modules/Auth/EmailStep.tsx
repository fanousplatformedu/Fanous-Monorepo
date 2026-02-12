"use client";

import { emailSchema, TFormData } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { TEmailStep } from "@/types/modules";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

import FloatingInput from "@ui/FloatingInput";

const EmailStep = ({ onContinue, onBack }: TEmailStep) => {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);

  const form = useForm<TFormData>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (data: TFormData) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    onContinue(data.email);
  };

  return (
    <>
      {/* ========= Title ========= */}
      <h2 className="text-2xl font-semibold text-center mb-10 text-white">
        {t("auth.welcomeBack")}
      </h2>

      {/* ========= Form ========= */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-10 w-[80%]"
      >
        <FloatingInput
          type="email"
          label={t("auth.emailLabel")}
          error={form.formState.errors.email?.message}
          {...form.register("email")}
        />

        <Button
          type="submit"
          className="w-full transition-all duration-300 hover:scale-[1.02]"
          disabled={loading}
          variant="brand"
        >
          {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
          {t("auth.continue")}
        </Button>
      </form>

      {/* ========= Back Button ========= */}
      <button
        type="button"
        onClick={onBack}
        className="mt-6 text-sm text-white/60 hover:text-white transition"
      >
        ← {t("auth.backToMethod")}
      </button>
    </>
  );
};

export default EmailStep;
