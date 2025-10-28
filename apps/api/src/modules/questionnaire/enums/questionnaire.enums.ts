import { QuestionType, VersionStatus, LanguageCode } from "@prisma/client";
import { registerEnumType } from "@nestjs/graphql";

registerEnumType(QuestionType, { name: "QuestionType" });
registerEnumType(VersionStatus, { name: "VersionStatus" });
registerEnumType(LanguageCode, { name: "LanguageCode" });

export { QuestionType, VersionStatus, LanguageCode };
