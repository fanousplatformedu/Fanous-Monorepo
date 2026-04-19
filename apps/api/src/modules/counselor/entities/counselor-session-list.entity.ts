import { CounselorGqlObjectNames } from "@counselor/enums/gql-names";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { CounselorSessionEntity } from "@counselor/entities/counselor-session.entity";

@ObjectType(CounselorGqlObjectNames.COUNSELOR_SESSION_LIST)
export class CounselorSessionListEntity {
  @Field() hasNext!: boolean;
  @Field(() => Int) page!: number;
  @Field(() => Int) total!: number;
  @Field(() => Int) limit!: number;
  @Field(() => [CounselorSessionEntity])
  items!: CounselorSessionEntity[];
}
