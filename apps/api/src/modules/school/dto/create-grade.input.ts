import { IsNotEmpty, IsOptional } from "class-validator";
import { InputType, Field, ID } from "@nestjs/graphql";

@InputType("CreateGradeInput")
export class CreateGradeInput {
  @Field(() => String) @IsNotEmpty() name!: string;
  @Field(() => String) @IsNotEmpty() tenantId!: string;
  @Field({ nullable: true }) @IsOptional() code?: string;
}

@InputType("UpdateGradeInput")
export class UpdateGradeInput {
  @Field(() => ID) id!: string;
  @Field(() => String) tenantId!: string;
  @Field({ nullable: true }) @IsOptional() name?: string;
  @Field({ nullable: true }) @IsOptional() code?: string;
}
