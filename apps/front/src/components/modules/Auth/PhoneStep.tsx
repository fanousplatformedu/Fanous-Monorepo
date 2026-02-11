"use client";

import { TFormData, TPhoneStep } from "@/types/modules";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@ui/button";

import FloatingInput from "@ui/FloatingInput";

const PhoneStep = ({ onContinue, onBack }: TPhoneStep) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<TFormData>({
    defaultValues: { phone: "" },
  });

  const onSubmit = async (data: { phone: string }) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    onContinue(data.phone);
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-10 text-white">
        Enter Mobile Number
      </h2>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-10 w-[80%]"
      >
        <FloatingInput
          type="tel"
          label="Mobile Number"
          {...form.register("phone")}
        />

        <Button
          type="submit"
          variant="brand"
          className="w-full"
          disabled={loading}
        >
          {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
          Continue
        </Button>
      </form>
      <button
        type="button"
        onClick={onBack}
        className="mt-6 text-sm text-white/60 hover:text-white transition"
      >
        ← Back to Method Selection
      </button>
    </>
  );
};

export default PhoneStep;
