import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class AssessmentBriefEntity {
  @Field() code: string;
  @Field() state: string;
  @Field(() => ID) id: string;
  @Field({ nullable: true }) scoredAt?: Date | null;
  @Field({ nullable: true }) version?: number | null;
  @Field({ nullable: true }) submittedAt?: Date | null;
}
