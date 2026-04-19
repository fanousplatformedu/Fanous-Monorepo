import { IsBoolean, IsOptional, IsString, Max, Min } from "class-validator";
import { StudentDashboardGqlInputNames } from "@student/enums/gql-names.enum";
import { Field, InputType, Int } from "@nestjs/graphql";

@InputType(StudentDashboardGqlInputNames.ListMyNotificationsInput)
export class ListMyNotificationsInput {
  @Field(() => Int, { defaultValue: 0 }) @Min(0) skip!: number;
  @Field({ nullable: true }) @IsOptional() @IsString() query?: string;
  @Field(() => Int, { defaultValue: 10 }) @Min(1) @Max(100) take!: number;
  @Field({ nullable: true }) @IsOptional() @IsBoolean() unreadOnly?: boolean;
}
