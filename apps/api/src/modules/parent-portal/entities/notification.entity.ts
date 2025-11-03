import { ObjectType, Field, ID, GraphQLISODateTime } from "@nestjs/graphql";

@ObjectType()
export class ParentNotificationEntity {
  @Field() status: string;
  @Field() channel: string;
  @Field(() => ID) id: string;
  @Field(() => GraphQLISODateTime) createdAt: Date;
  @Field({ nullable: true }) payload?: string | null;
  @Field({ nullable: true }) templateCode?: string | null;
  @Field(() => GraphQLISODateTime, { nullable: true }) sentAt?: Date | null;
}
