import { CounselorAssignmentItemEntity } from "@counselor/entities/counselor-assignment-item.entity";
import { CounselorGqlObjectNames } from "@counselor/enums/gql-names";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType(CounselorGqlObjectNames.COUNSELOR_ASSIGNMENT_LIST)
export class CounselorAssignmentListEntity {
  @Field() hasNext!: boolean;
  @Field(() => Int) page!: number;
  @Field(() => Int) total!: number;
  @Field(() => Int) limit!: number;
  @Field(() => [CounselorAssignmentItemEntity])
  items!: CounselorAssignmentItemEntity[];
}
