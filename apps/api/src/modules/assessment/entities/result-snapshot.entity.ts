import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class ResultSnapshotEntity {
  @Field(() => ID) id: string;
  @Field(() => Date) createdAt: Date;
  @Field(() => String) userId: string;
  @Field(() => String) tenantId: string;
  @Field(() => String) scoresJson: string;
  @Field(() => String) summaryJson: string;
  @Field(() => String) assessmentId: string;
}
