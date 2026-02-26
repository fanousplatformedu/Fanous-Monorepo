import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { Field, InputType, Int } from "@nestjs/graphql";
import { UserGqlInputNames } from "@user/enums/gql-names.enum";
import { Role, UserStatus } from "@prisma/client";

@InputType(UserGqlInputNames.ListSchoolMembersInput)
export class ListSchoolMembersInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  query?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @Field(() => Int, { defaultValue: 20 })
  @IsInt()
  @Min(1)
  @Max(50)
  take!: number;

  @Field(() => Int, { defaultValue: 0 })
  @IsInt()
  @Min(0)
  skip!: number;
}
