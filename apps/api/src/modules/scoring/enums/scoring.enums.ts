import { registerEnumType } from "@nestjs/graphql";
import { LanguageCode } from "@prisma/client";

registerEnumType(LanguageCode, { name: "LanguageCode" });
export { LanguageCode };
