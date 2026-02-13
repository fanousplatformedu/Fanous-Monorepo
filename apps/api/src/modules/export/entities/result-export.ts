import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PreviewResultEntity {
  @Field(() => Int) count!: number;
  @Field(() => [String]) rows!: string[];
  @Field(() => [String]) headers!: string[];
}
