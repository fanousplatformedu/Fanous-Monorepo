import { ObjectType, Field, ID, GraphQLISODateTime } from "@nestjs/graphql";

@ObjectType()
export class ConsentEntity {
  @Field(() => ID) id!: string;
  @Field(() => String) type!: string;
  @Field(() => String) status!: string;
  @Field(() => GraphQLISODateTime) createdAt!: Date;
  @Field(() => GraphQLISODateTime) updatedAt!: Date;
  @Field(() => String, { nullable: true }) data?: string | null;
}
