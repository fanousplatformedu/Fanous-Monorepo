"use client";

import { TOtpFlipCardProps } from "@/types/modules";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const OtpFlipCard = ({ flipped, front, back }: TOtpFlipCardProps) => {
  return (
    <div className="perspective w-full">
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative min-h-[540px] w-full transform-style-preserve-3d"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className={cn(
            "absolute inset-0 backface-hidden",
            "[backface-visibility:hidden]",
          )}
        >
          {front}
        </div>

        <div
          className={cn(
            "absolute inset-0 rotate-y-180 [backface-visibility:hidden]",
          )}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
};

export default OtpFlipCard;
