import { AdminPasswordGqlObjectNames } from "@adminPassword/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(AdminPasswordGqlObjectNames.PasswordResult)
export class PasswordResultEntity {
  @Field() message!: string;
  @Field({ nullable: true }) adminUserId?: string;
  @Field({ nullable: true }) tempPassword?: string;
  @Field({ nullable: true }) notificationError?: string;
}
