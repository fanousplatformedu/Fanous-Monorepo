// ============ Auth ==============
export type AuthMethod = "email" | "phone";
export type AuthStep = "method" | "credentials" | "otp";

export type TOtpStepProps = {
  value: string;
  onBack: () => void;
  onError: () => void;
  method: "email" | "phone";
};

export type TAuthMethod = {
  selected?: "email" | "phone";
  onSelect: (method: "email" | "phone") => void;
};

export type TPhoneStep = {
  onBack: () => void;
  onContinue: (phone: string) => void;
};

export type TFormData = {
  phone: string;
};

export type TEmailStep = {
  onBack: () => void;
  onContinue: (email: string) => void;
};
