import { IsNotEmpty, IsOptional } from "class-validator";
import { InputType, Field, ID } from "@nestjs/graphql";

@InputType("CreateGradeInput")
export class CreateGradeInput {
  @Field() @IsNotEmpty() name: string;
  @Field() @IsNotEmpty() tenantId: string;
  @Field({ nullable: true }) @IsOptional() code?: string;
}

@InputType("UpdateGradeInput")
export class UpdateGradeInput {
  @Field() tenantId: string;
  @Field(() => ID) id: string;
  @Field({ nullable: true }) @IsOptional() name?: string;
  @Field({ nullable: true }) @IsOptional() code?: string;
}
