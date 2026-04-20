import { ParentGqlObjectNames } from "@parent/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(ParentGqlObjectNames.ParentAssessmentStudent)
export class ParentAssessmentStudentEntity {
  @Field() id!: string;
  @Field({ nullable: true }) email!: string;
  @Field({ nullable: true }) mobile!: string;
  @Field({ nullable: true }) fullName!: string;
  @Field({ nullable: true }) avatarUrl!: string;
}
