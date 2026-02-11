"use client";

import { authMethodStyles } from "@/utils/style";
import { TAuthMethod } from "@/types/modules";

const AuthMethodStep = ({ selected, onSelect }: TAuthMethod) => {
  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-10 text-white">
        Choose Login Method
      </h2>

      <div className={authMethodStyles.container}>
        <button
          onClick={() => onSelect("email")}
          className={`
            ${authMethodStyles.option}
            ${selected === "email" ? authMethodStyles.optionActive : ""}
          `}
        >
          Continue with Email
        </button>

        <button
          onClick={() => onSelect("phone")}
          className={`
            ${authMethodStyles.option}
            ${selected === "phone" ? authMethodStyles.optionActive : ""}
          `}
        >
          Continue with Mobile Number
        </button>
      </div>
    </>
  );
};

export default AuthMethodStep;
