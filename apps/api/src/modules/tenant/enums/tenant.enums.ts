import { LicensePlan, SubscriptionStatus, LanguageCode } from "@prisma/client";
import { registerEnumType } from "@nestjs/graphql";

registerEnumType(LicensePlan, { name: "LicensePlan" });
registerEnumType(SubscriptionStatus, { name: "SubscriptionStatus" });
registerEnumType(LanguageCode, { name: "LanguageCode" });

export { LicensePlan, SubscriptionStatus, LanguageCode };
