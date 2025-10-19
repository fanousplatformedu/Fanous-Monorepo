import { Field, ObjectType, ID } from "@nestjs/graphql";
import { GqlObjectNames } from "@common/enums/gql-names.enum";
import { Role } from "src/common/enums/role.enum";

@ObjectType(GqlObjectNames.AUTH_PAYLOAD)
export class AuthPayloadEntity {
  @Field() name: string;
  @Field(() => ID) id: string;
  @Field() accessToken: string;
  @Field(() => Role) role: Role;
  @Field() googleCalendarEnabled: boolean;
  @Field({ nullable: true }) avatar?: string;
}
