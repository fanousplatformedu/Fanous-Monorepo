import { AssessmentGqlObjectNames } from "@assessment/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";
import { IntelligenceKey } from "@prisma/client";

@ObjectType(AssessmentGqlObjectNames.AssessmentQuestion)
export class AssessmentQuestionEntity {
  @Field() id!: string;
  @Field() code!: number;
  @Field() text!: string;
  @Field() order!: number;
  @Field() isActive!: boolean;
  @Field(() => [String]) intelligenceKeys!: IntelligenceKey[];
}
