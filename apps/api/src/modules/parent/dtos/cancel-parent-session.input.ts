import { IsOptional, IsString } from "class-validator";
import { ParentGqlInputNames } from "@parent/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType(ParentGqlInputNames.CancelParentSessionInput)
export class CancelParentSessionInput {
  @Field() @IsString() sessionId!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() reason!: string;
}
