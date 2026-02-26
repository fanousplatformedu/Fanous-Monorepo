import { IsBoolean, IsOptional, IsString } from "class-validator";
import { UserGqlInputNames } from "@user/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType(UserGqlInputNames.RemoveSchoolMemberInput)
export class RemoveSchoolMemberInput {
  @Field() @IsString() userId!: string;
  @Field({ nullable: true }) @IsOptional() @IsBoolean() hardDelete?: boolean;
}
