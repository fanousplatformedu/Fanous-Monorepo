import { AssessmentGqlObjectNames } from "@assessment/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(AssessmentGqlObjectNames.AssignmentRef)
export class AssignmentRefEntity {
  @Field() id!: string;
  @Field() title!: string;
}
