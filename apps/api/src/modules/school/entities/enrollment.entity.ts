import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class EnrollmentEntity {
  @Field(() => ID) id!: string;
  @Field(() => Date) startedAt!: Date;
  @Field(() => String) tenantId!: string;
  @Field(() => String) studentId!: string;
  @Field(() => String) classroomId!: string;
  @Field(() => Date, { nullable: true }) endedAt?: Date | null;
}
