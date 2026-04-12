"use client";

import { TAuthFormActionsProps } from "@/types/modules";
import { motion } from "framer-motion";
import { Button } from "@ui/button";

import * as L from "lucide-react";

const AuthFormActions = ({
  onBack,
  backText,
  submitText,
  loadingText,
  isLoading,
}: TAuthFormActionsProps) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex-1"
      >
        <Button
          type="button"
          onClick={onBack}
          variant={"brandChip"}
          className="h-11 w-full rounded-2xl border-border/60 bg-card/40 backdrop-blur-xl hover:bg-card/70"
        >
          <L.ChevronLeft className="mr-1 h-4 w-4" />
          {backText}
        </Button>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex-1"
      >
        <Button
          type="submit"
          variant={"brand"}
          disabled={isLoading}
          className="h-11 w-full rounded-2xl "
        >
          {isLoading ? (
            <>
              <L.Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {loadingText}
            </>
          ) : (
            <>
              {submitText}
              <L.ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default AuthFormActions;
