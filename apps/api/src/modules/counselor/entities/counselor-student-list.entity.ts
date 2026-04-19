import { CounselorStudentCardEntity } from "@counselor/entities/counselor-student-card.entity";
import { CounselorGqlObjectNames } from "@counselor/enums/gql-names";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType(CounselorGqlObjectNames.COUNSELOR_STUDENT_LIST)
export class CounselorStudentListEntity {
  @Field() hasNext!: boolean;
  @Field(() => Int) page!: number;
  @Field(() => Int) total!: number;
  @Field(() => Int) limit!: number;
  @Field(() => [CounselorStudentCardEntity])
  items!: CounselorStudentCardEntity[];
}
