import { ObjectType, Field, ID, Float } from "@nestjs/graphql";

@ObjectType()
export class ScoreEntity {
  @Field(() => ID) id: string;
  @Field(() => Float) value: number;
  @Field(() => Date) createdAt: Date;
  @Field(() => String) metric: string;
  @Field(() => String) tenantId: string;
  @Field(() => String) assessmentId: string;
  @Field(() => String, { nullable: true }) meta?: string | null;
  @Field(() => Float, { nullable: true }) weight?: number | null;
}
