import { Field, InputType, Int, registerEnumType } from "@nestjs/graphql";
import { Min, IsOptional, IsEnum, IsString } from "class-validator";
import { AccessRequestGqlInputNames } from "@accessRequest/enums/gql-names.enum";
import { AccessRequestStatus } from "@prisma/client";
import { AccessRequestRole } from "@prisma/client";

registerEnumType(AccessRequestStatus, {
  name: "AccessRequestStatus",
});

registerEnumType(AccessRequestRole, {
  name: "AccessRequestRole",
});

@InputType(AccessRequestGqlInputNames.ListAccessRequestsInput)
export class ListAccessRequestsInput {
  @Field(() => Int, { defaultValue: 0 }) @Min(0) skip!: number;
  @Field(() => Int, { defaultValue: 10 }) @Min(0) take!: number;
  @Field({ nullable: true }) @IsOptional() @IsString() query?: string;
  @Field(() => AccessRequestStatus, { nullable: true })
  @IsOptional()
  @IsEnum(AccessRequestStatus)
  status?: AccessRequestStatus;
  @Field(() => AccessRequestRole, { nullable: true })
  @IsOptional()
  @IsEnum(AccessRequestRole)
  requestedRole?: AccessRequestRole;
}
