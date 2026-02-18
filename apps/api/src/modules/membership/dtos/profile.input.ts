import { IsOptional, IsString, Length, Matches } from "class-validator";
import { MembershipGqlInputNames } from "@membership/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType(MembershipGqlInputNames.PROFILE_INPUT)
export class ProfileInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 60)
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 60)
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/^\d{10}$/, { message: "nationalId must be 10 digits" })
  nationalId?: string;

  @Field({ nullable: true, description: "Just for Student" })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  grade?: string;
}
