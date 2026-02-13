import { InputType, Field, ID, Int, Float } from "@nestjs/graphql";
import { IsInt, IsOptional, Min } from "class-validator";

@InputType("CreateOptionInput")
export class CreateOptionInput {
  @Field(() => String) text!: string;
  @Field(() => String) value!: string;
  @Field(() => String) tenantId!: string;
  @Field(() => String) questionId!: string;
  @Field(() => Float, { nullable: true }) @IsOptional() weight?: number;
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}

@InputType("UpdateOptionInput")
export class UpdateOptionInput {
  @Field(() => ID) id!: string;
  @Field(() => String) tenantId!: string;
  @Field({ nullable: true }) @IsOptional() text?: string;
  @Field({ nullable: true }) @IsOptional() value?: string;
  @Field(() => Float, { nullable: true }) @IsOptional() weight?: number;
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
