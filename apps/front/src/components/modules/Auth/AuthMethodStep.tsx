"use client";

import { authMethodStyles } from "@/utils/style";
import { TAuthMethod } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";

const AuthMethodStep = ({ selected, onSelect }: TAuthMethod) => {
  const { t } = useI18n();

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-10 text-white">
        {t("auth.chooseMethod")}
      </h2>

      <div className={authMethodStyles.container}>
        <button
          onClick={() => onSelect("email")}
          className={`
            ${authMethodStyles.option}
            ${selected === "email" ? authMethodStyles.optionActive : ""}
          `}
        >
          {t("auth.emailMethod")}
        </button>

        <button
          onClick={() => onSelect("phone")}
          className={`
            ${authMethodStyles.option}
            ${selected === "phone" ? authMethodStyles.optionActive : ""}
          `}
        >
          {t("auth.phoneMethod")}
        </button>
      </div>
    </>
  );
};

export default AuthMethodStep;
