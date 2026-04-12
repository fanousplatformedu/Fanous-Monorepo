"use client";

import { motion } from "framer-motion";

const AuthPageFooter = ({ text }: { text: string }) => {
  return (
    <motion.p
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { delay: 0.18, duration: 0.35 } },
      }}
      className="mt-5 text-center text-sm text-muted-foreground"
    >
      {text}
    </motion.p>
  );
};

export default AuthPageFooter;
