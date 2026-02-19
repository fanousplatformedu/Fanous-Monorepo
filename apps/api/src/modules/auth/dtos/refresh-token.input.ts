import { IsNotEmpty, IsString } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { GqlInputNames } from "@auth/enums/gql-names.enum";

@InputType(GqlInputNames.REFRESH_TOKEN_INPUT)
export class RefreshTokenInput {
  @Field() @IsString() @IsNotEmpty() schoolId!: string;
}
