import { InputType, Field, ID, Int, Float } from "@nestjs/graphql";
import { IsInt, IsOptional, Min } from "class-validator";

@InputType("CreateOptionInput")
export class CreateOptionInput {
  @Field() text: string;
  @Field() value: string;
  @Field() tenantId: string;
  @Field() questionId: string;
  @Field(() => Float, { nullable: true }) @IsOptional() weight?: number;
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}

@InputType("UpdateOptionInput")
export class UpdateOptionInput {
  @Field() tenantId: string;
  @Field(() => ID) id: string;
  @Field({ nullable: true }) @IsOptional() text?: string;
  @Field({ nullable: true }) @IsOptional() value?: string;
  @Field(() => Float, { nullable: true }) @IsOptional() weight?: number;
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
