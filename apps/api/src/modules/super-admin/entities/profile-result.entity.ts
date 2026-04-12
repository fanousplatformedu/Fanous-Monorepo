import { SuperAdminGqlObjectNames } from "@superAdmin/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(SuperAdminGqlObjectNames.AdminProfileResult)
export class AdminProfileResultEntity {
  @Field() id!: string;
  @Field() message!: string;
  @Field({ nullable: true }) email?: string;
  @Field({ nullable: true }) fullName?: string;
}
