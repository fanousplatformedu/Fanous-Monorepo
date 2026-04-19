import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { AccessRequestGqlInputNames } from "@accessRequest/enums/gql-names.enum";
import { AccessRequestRole } from "@prisma/client";

registerEnumType(AccessRequestRole, {
  name: "AccessRequestRole",
});

@InputType(AccessRequestGqlInputNames.SubmitAccessRequestInput)
export class SubmitAccessRequestInput {
  @Field() @IsString() schoolId!: string;
  @Field({ nullable: true }) @IsOptional() @IsEmail() email?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() mobile?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() fullName?: string;
  @Field(() => AccessRequestRole)
  @IsEnum(AccessRequestRole)
  requestedRole!: AccessRequestRole;
}
