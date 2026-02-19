import { MembershipGqlInputNames } from "@membership/enums/gql-names.enum";
import { IsNotEmpty, IsString } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

@InputType(MembershipGqlInputNames.MY_MEMBERSHIPS_INPUT)
export class MyMembershipsInput {
  @Field() @IsString() @IsNotEmpty() schoolId!: string;
}
