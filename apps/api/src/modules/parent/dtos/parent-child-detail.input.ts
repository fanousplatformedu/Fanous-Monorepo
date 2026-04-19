import { IsNotEmpty, IsString } from "class-validator";
import { ParentGqlInputNames } from "@parent/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType(ParentGqlInputNames.ParentChildDetailInput)
export class ParentChildDetailInput {
  @Field() @IsString() @IsNotEmpty() childId!: string;
}
