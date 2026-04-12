import { AssessmentGqlObjectNames } from "@assessment/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(AssessmentGqlObjectNames.AssessmentStudent)
export class AssessmentStudentEntity {
  @Field(() => String) id!: string;
  @Field(() => String, { nullable: true }) email?: string | null;
  @Field(() => String, { nullable: true }) fullName?: string | null;
}
