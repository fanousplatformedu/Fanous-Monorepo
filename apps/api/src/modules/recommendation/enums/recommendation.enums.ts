import { RecommendationType } from "@prisma/client";
import { registerEnumType } from "@nestjs/graphql";

registerEnumType(RecommendationType, { name: "RecommendationType" });
export { RecommendationType };
