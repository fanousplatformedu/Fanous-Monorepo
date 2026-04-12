import { SchoolGqlObjectNames } from "@school/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(SchoolGqlObjectNames.Enrollment)
export class EnrollmentEntity {
  @Field() id!: string;
  @Field() startedAt!: Date;
  @Field() createdAt!: Date;
  @Field() updatedAt!: Date;
  @Field() schoolId!: string;
  @Field() studentId!: string;
  @Field() classroomId!: string;
  @Field({ nullable: true }) endedAt?: Date;
}
