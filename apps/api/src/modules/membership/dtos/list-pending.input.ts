import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { MembershipGqlInputNames } from "@membership/enums/gql-names.enum";
import { Field, InputType, Int } from "@nestjs/graphql";

@InputType(MembershipGqlInputNames.LIST_PENDING_REQUESTS_INPUT)
export class ListPendingRequestsInput {
  @Field() @IsString() @IsNotEmpty() schoolId!: string;
  @Field(() => Int, { nullable: true }) @IsOptional() @IsInt() take?: number;
  @Field(() => Int, { nullable: true }) @IsOptional() @IsInt() skip?: number;
}
