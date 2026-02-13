import { ObjectType, Field, ID, GraphQLISODateTime } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";

@ObjectType()
export class ParentNotificationEntity {
  @Field(() => ID) id!: string;
  @Field(() => String) status!: string;
  @Field(() => String) channel!: string;
  @Field(() => GraphQLISODateTime) createdAt!: Date;
  @Field(() => String, { nullable: true }) templateCode?: string | null;
  @Field(() => GraphQLJSON, { nullable: true }) payload?: Record<
    string,
    any
  > | null;
  @Field(() => GraphQLISODateTime, { nullable: true }) sentAt?: Date | null;
}
