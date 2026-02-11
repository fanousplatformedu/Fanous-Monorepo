"use client";

import { AuthMethod, AuthStep } from "@/types/modules";
import { authCardStyles } from "@/utils/style";
import { useState } from "react";
import { motion } from "framer-motion";

import AuthMethodStep from "./AuthMethodStep";
import EmailStep from "./EmailStep";
import PhoneStep from "./PhoneStep";
import OtpStep from "./OtpStep";

const AuthCard = () => {
  const [step, setStep] = useState<AuthStep>("method");
  const [method, setMethod] = useState<AuthMethod>("email");
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const triggerError = () => {
    setError(true);
    setTimeout(() => setError(false), 500);
  };

  /* =========== Dynamic Rotation ================ */
  const getRotation = () => {
    if (step === "otp") return 180;
    return 0;
  };

  return (
    <motion.div
      initial={{ y: -150, scaleY: 0.8 }}
      animate={{
        y: 0,
        scaleY: [0.8, 1.08, 0.96, 1.02, 1],
        x: error ? [-10, 10, -8, 8, -4, 4, 0] : 0,
      }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className={authCardStyles.wrapper}
    >
      <div
        className={authCardStyles.flipContainer}
        style={{
          transform: `rotateY(${getRotation()}deg)`,
          transition: "transform 0.8s cubic-bezier(.4,.2,.2,1)",
        }}
      >
        {/* FRONT (Method + Credentials) */}
        <div className={authCardStyles.cardBase}>
          {step === "method" && (
            <AuthMethodStep
              selected={method}
              onSelect={(m) => {
                setMethod(m);
                setStep("credentials");
              }}
            />
          )}

          {step === "credentials" && method === "email" && (
            <EmailStep
              onBack={() => setStep("method")}
              onContinue={(email) => {
                setValue(email);
                setStep("otp");
              }}
            />
          )}

          {step === "credentials" && method === "phone" && (
            <PhoneStep
              onBack={() => setStep("method")}
              onContinue={(phone) => {
                setValue(phone);
                setStep("otp");
              }}
            />
          )}
        </div>

        {/* BACK  */}
        <div
          className={`${authCardStyles.cardBase} ${authCardStyles.backSide}`}
        >
          {step === "otp" && (
            <OtpStep
              method={method}
              value={value}
              onBack={() => setStep("credentials")}
              onError={triggerError}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AuthCard;
