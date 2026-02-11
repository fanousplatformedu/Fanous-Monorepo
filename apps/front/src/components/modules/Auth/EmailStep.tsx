"use client";

import { emailSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@ui/button";
import { z } from "zod";

import FloatingInput from "@ui/FloatingInput";

type FormData = z.infer<typeof emailSchema>;

const EmailStep = ({
  onContinue,
  onBack,
}: {
  onContinue: (email: string) => void;
  onBack: () => void;
}) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    onContinue(data.email);
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-10 text-white">
        Welcome Back 😀
      </h2>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-10 w-[80%]"
      >
        <FloatingInput
          type="email"
          label="Email"
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

export default EmailStep;
