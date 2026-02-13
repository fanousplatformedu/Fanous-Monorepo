import { GraphQLISODateTime, Int } from "@nestjs/graphql";
import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class AssessmentBriefEntity {
  @Field(() => ID) id!: string;
  @Field(() => String) code!: string;
  @Field(() => String) state!: string;
  @Field(() => Int, { nullable: true }) version?: number | null;
  @Field(() => GraphQLISODateTime, { nullable: true }) scoredAt?: Date | null;
  @Field(() => GraphQLISODateTime, { nullable: true })
  submittedAt?: Date | null;
}
