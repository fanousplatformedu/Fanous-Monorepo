import { InputType, Field, Int, ID } from "@nestjs/graphql";
import { IsInt, IsOptional, Min } from "class-validator";

@InputType("CreateClassroomInput")
export class CreateClassroomInput {
  @Field() name: string;
  @Field() gradeId: string;
  @Field() tenantId: string;
  @Field({ nullable: true }) code?: string;
  @Field(() => Int) @IsInt() @Min(1900) year: number;
}

@InputType("UpdateClassroomInput")
export class UpdateClassroomInput {
  @Field(() => ID) id: string;
  @Field() tenantId: string;
  @Field({ nullable: true }) @IsOptional() gradeId?: string;
  @Field({ nullable: true }) @IsOptional() name?: string;
  @Field({ nullable: true }) @IsOptional() code?: string;
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1900)
  year?: number;
}
