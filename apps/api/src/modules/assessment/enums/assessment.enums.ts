import { AssessmentState, LanguageCode } from "@prisma/client";
import { registerEnumType } from "@nestjs/graphql";

registerEnumType(AssessmentState, { name: "AssessmentState" });
registerEnumType(LanguageCode, { name: "LanguageCode" });

export { AssessmentState, LanguageCode };
