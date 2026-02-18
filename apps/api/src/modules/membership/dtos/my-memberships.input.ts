import { MembershipGqlInputNames } from "@modules/membership/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";
import { IsUUID } from "class-validator";

@InputType(MembershipGqlInputNames.MY_MEMBERSHIPS_INPUT)
export class MyMembershipsInput {
  @Field() @IsUUID() schoolId!: string;
}
