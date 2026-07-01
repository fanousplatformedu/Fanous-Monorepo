import { AssessmentGqlObjectNames } from "@assessment/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(AssessmentGqlObjectNames.AssessmentStudent)
export class AssessmentStudentEntity {
  @Field(() => String) id!: string;
  @Field(() => String, { nullable: true }) email?: string | null;
  @Field(() => String, { nullable: true }) firstName?: string | null;
  @Field(() => String, { nullable: true }) lastName?: string | null;
}
