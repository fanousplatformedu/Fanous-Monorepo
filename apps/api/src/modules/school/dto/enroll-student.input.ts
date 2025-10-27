import { InputType, Field } from "@nestjs/graphql";

@InputType("EnrollStudentInput")
export class EnrollStudentInput {
  @Field() tenantId: string;
  @Field() studentId: string;
  @Field() classroomId: string;
  @Field(() => Date, { nullable: true }) startedAt?: Date;
}
