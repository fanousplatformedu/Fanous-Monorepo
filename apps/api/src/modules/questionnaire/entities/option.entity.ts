import { ObjectType, Field, ID, Int, Float } from "@nestjs/graphql";

@ObjectType()
export class OptionEntity {
  @Field(() => ID) id: string;
  @Field(() => Int) order: number;
  @Field(() => String) text: string;
  @Field(() => String) value: string;
  @Field(() => String) tenantId: string;
  @Field(() => String) questionId: string;
  @Field(() => Float, { nullable: true }) weight?: number | null;
}
