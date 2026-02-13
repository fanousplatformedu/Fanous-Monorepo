import { Field, InputType } from "@nestjs/graphql";
import { OtpChannel, Role } from "@prisma/client";
import { GqlInputNames } from "@auth/enum/gql-names.enum";

@InputType(GqlInputNames.AUTH_REGISTER_REQUEST_INPUT)
export class AuthRegisterRequestInput {
  @Field(() => Role) desiredRole!: Role;
  @Field(() => String) identifier!: string;
  @Field(() => OtpChannel) channel!: OtpChannel;
  @Field(() => String, { nullable: true }) name?: string;
  @Field(() => String, { nullable: true }) tenantId?: string;
}
