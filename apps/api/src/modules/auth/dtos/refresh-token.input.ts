import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { GqlInputNames } from "@auth/enums/gql-names.enum";

@InputType(GqlInputNames.REFRESH_TOKEN_INPUT)
export class RefreshTokenInput {
  @Field() @IsUUID() schoolId!: string;
  @Field() @IsString() @IsNotEmpty() refreshToken!: string;
}
