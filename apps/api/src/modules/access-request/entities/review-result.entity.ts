import { AccessRequestGqlObjectNames } from "@accessRequest/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(AccessRequestGqlObjectNames.ReviewResult)
export class ReviewResultEntity {
  @Field() message!: string;
  @Field() requestId!: string;
  @Field({ nullable: true }) createdUserId?: string;
  @Field({ nullable: true }) notificationError?: string;
}
