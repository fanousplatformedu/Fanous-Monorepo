"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { OTP_LENGTH, RESEND_SECONDS } from "@/utils/constant";
import { TOtpStepProps } from "@/types/modules";
import { otpStyles } from "@/utils/style";
import { Loader2 } from "lucide-react";
import { Button } from "@ui/button";

const OtpStep = ({ method, value, onError, onBack }: TOtpStepProps) => {
  const isEmail = method === "email";

  const [otp, setOtp] = useState<string[]>(() => Array(OTP_LENGTH).fill(""));

  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  /* ========== Auto Focus First Input ========= */
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  /* ========= Countdown Timer =========== */
  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [seconds]);

  /* ========= Handle Input Change ========== */
  const handleChange = useCallback(
    (inputValue: string, index: number) => {
      if (!/^\d?$/.test(inputValue)) return;
      const updated = [...otp];
      updated[index] = inputValue;
      setOtp(updated);
      if (inputValue && index < OTP_LENGTH - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    },
    [otp],
  );

  /* ======= Handle Backspace ====== */
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const updated = [...otp];
        updated[index] = "";
        setOtp(updated);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  /* ======== Handle Paste ========== */
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const updated = pasted.split("");
    while (updated.length < OTP_LENGTH) {
      updated.push("");
    }
    setOtp(updated);
    const lastIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputsRef.current[lastIndex]?.focus();
  };

  /* ========== Verify OTP ========= */
  const verify = async () => {
    if (otp.join("").length !== OTP_LENGTH) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    if (otp.join("") !== "123456") onError();
    setLoading(false);
  };

  /* ======== Resend OTP ========== */
  const resend = () => {
    if (seconds > 0) return;
    setSeconds(RESEND_SECONDS);
    setOtp(Array(OTP_LENGTH).fill(""));
    inputsRef.current[0]?.focus();
  };

  const isComplete = otp.every((digit) => digit !== "");

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-2 text-white">
        {isEmail ? "Verify Email" : "Verify Mobile Number"}
      </h2>

      <p className="text-center text-sm mb-8 text-white/80">
        Code sent to <br />
        <span className="font-medium text-white">{value}</span>
      </p>

      {/* OTP Inputs */}
      <div className={otpStyles.wrapper}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            maxLength={1}
            inputMode="numeric"
            className={`${otpStyles.input} ${digit ? otpStyles.filled : ""}`}
          />
        ))}
      </div>

      <Button
        onClick={verify}
        variant="brand"
        className="w-full cursor-pointer"
        disabled={!isComplete || loading}
      >
        {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
        Verify & Continue
      </Button>

      <div className="text-center mt-6 text-sm text-white/70">
        {seconds > 0 ? (
          <span>Resend in {seconds}s</span>
        ) : (
          <button
            onClick={resend}
            className="text-blue-50 hover:underline transition cursor-pointer"
          >
            Resend Code
          </button>
        )}
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="mt-4 text-sm text-white/60 hover:text-white transition"
      >
        ← Back to {isEmail ? "Email" : "Mobile Number"}
      </button>
    </>
  );
};

export default OtpStep;
