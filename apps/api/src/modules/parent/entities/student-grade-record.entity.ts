import { Field, Float, ObjectType } from "@nestjs/graphql";
import { ParentGqlObjectNames } from "@parent/enums/gql-names.enum";
import { GraphQLISODateTime } from "@nestjs/graphql";

@ObjectType(ParentGqlObjectNames.StudentGradeRecord)
export class StudentGradeRecordEntity {
  @Field() id!: string;
  @Field() subject!: string;
  @Field(() => Float) score!: number;
  @Field(() => Float) maxScore!: number;
  @Field({ nullable: true }) examTitle!: string;
  @Field({ nullable: true }) termLabel!: string;
  @Field(() => GraphQLISODateTime) createdAt!: Date;
  @Field(() => GraphQLISODateTime) recordedAt!: Date;
}
