import { IsString } from "class-validator";
import { UserGqlInputNames } from "@user/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType(UserGqlInputNames.SchoolMemberInput)
export class SchoolMemberInput {
  @Field() @IsString() userId!: string;
}
