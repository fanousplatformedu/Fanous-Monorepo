import { InputType, Field } from "@nestjs/graphql";

@InputType("EnrollStudentInput")
export class EnrollStudentInput {
  @Field(() => String) tenantId!: string;
  @Field(() => String) studentId!: string;
  @Field(() => String) classroomId!: string;
  @Field(() => Date, { nullable: true }) startedAt?: Date;
}
