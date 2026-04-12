import { SuperAdminGqlObjectNames } from "@superAdmin/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(SuperAdminGqlObjectNames.PasswordResult)
export class PasswordResultEntity {
  @Field() message!: string;
  @Field({ nullable: true }) adminUserId?: string;
  @Field({ nullable: true }) tempPassword?: string;
  @Field({ nullable: true }) notificationError?: string;
}
