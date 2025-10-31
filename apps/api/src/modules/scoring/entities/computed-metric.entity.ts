import { ObjectType, Field, Float } from "@nestjs/graphql";

@ObjectType()
export class ComputedMetricEntity {
  @Field(() => String) key: string;
  @Field(() => Float) value: number;
  @Field(() => Float, { nullable: true }) raw?: number | null;
  @Field(() => String, { nullable: true }) label?: string | null;
}
