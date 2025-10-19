"use client";

import { useRouter } from "next/navigation";
import { Button } from "@ui/button";
import { motion } from "framer-motion";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 text-center bg-gradient-to-br from-white to-sky-100">
      <motion.div
        className="text-[8rem] font-extrabold text-blue-500"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        404
      </motion.div>

      <motion.p
        className="text-2xl font-semibold text-gray-800 mt-2"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Page Not Found
      </motion.p>

      <motion.p
        className="mt-2 text-gray-500"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </motion.p>

      <motion.div
        className="mt-6 flex gap-4 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Button variant="secondary" onClick={() => router.back()}>
          Go Back
        </Button>
        <Button variant="default" onClick={() => router.push("/")}>
          Go Home
        </Button>
      </motion.div>

      <motion.div
        className="w-32 h-32 mt-12 rounded-full bg-blue-100 border-4 border-blue-200 animate-bounce-slow"
        initial={{ scale: 0.9 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
