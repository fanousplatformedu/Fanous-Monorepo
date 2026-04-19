import { Field, Int, ObjectType } from "@nestjs/graphql";
import { SchoolGqlObjectNames } from "@school/enums/gql-names.enum";
import { EnrollmentEntity } from "@school/entities/enrollment.entity";

@ObjectType(SchoolGqlObjectNames.EnrollmentList)
export class EnrollmentListEntity {
  @Field(() => Int) take!: number;
  @Field(() => Int) skip!: number;
  @Field(() => Int) total!: number;
  @Field(() => [EnrollmentEntity]) items!: EnrollmentEntity[];
}
