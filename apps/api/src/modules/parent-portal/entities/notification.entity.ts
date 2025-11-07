import { ObjectType, Field, ID, GraphQLISODateTime } from "@nestjs/graphql";

import GraphQLJSON from "graphql-type-json";

@ObjectType()
export class ParentNotificationEntity {
  @Field() status: string;
  @Field() channel: string;
  @Field(() => ID) id: string;
  @Field(() => GraphQLISODateTime) createdAt: Date;
  @Field({ nullable: true }) templateCode?: string | null;
  @Field(() => GraphQLJSON, { nullable: true }) payload?: any | null;
  @Field(() => GraphQLISODateTime, { nullable: true }) sentAt?: Date | null;
}
