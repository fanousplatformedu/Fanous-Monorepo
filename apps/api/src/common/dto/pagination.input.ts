import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 12 })
  limit?: number;
  @Field(() => Int, { defaultValue: 0 })
  offset?: number;
}

@ObjectType()
export class PageInfoEntity {
  @Field() hasNextPage: boolean;
  @Field(() => Int) total: number;
  @Field(() => Int) limit: number;
  @Field(() => Int) offset: number;
  @Field() hasPreviousPage: boolean;
}
