import { InputType, Field, Int, ID } from "@nestjs/graphql";
import { IsInt, IsOptional, Min } from "class-validator";

@InputType("CreateClassroomInput")
export class CreateClassroomInput {
  @Field(() => String) name!: string;
  @Field(() => ID) gradeId!: string;
  @Field(() => String) tenantId!: string;
  @Field({ nullable: true }) code?: string;
  @Field(() => Int) @IsInt() @Min(1900) year!: number;
}

@InputType("UpdateClassroomInput")
export class UpdateClassroomInput {
  @Field(() => ID) id!: string;
  @Field(() => String) tenantId!: string;
  @Field({ nullable: true }) @IsOptional() name?: string;
  @Field({ nullable: true }) @IsOptional() code?: string;
  @Field({ nullable: true }) @IsOptional() gradeId?: string;
  @Field(() => Int, { nullable: true }) @IsOptional() @IsInt() year?: number;
}
