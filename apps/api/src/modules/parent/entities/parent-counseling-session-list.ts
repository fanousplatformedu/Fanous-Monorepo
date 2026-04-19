import { ParentCounselingSessionEntity } from "@parent/entities/parent-counseling-session.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ParentGqlObjectNames } from "@parent/enums/gql-names.enum";

@ObjectType(ParentGqlObjectNames.ParentCounselingSessionList)
export class ParentCounselingSessionListEntity {
  @Field(() => Int) take!: number;
  @Field(() => Int) skip!: number;
  @Field(() => Int) total!: number;
  @Field(() => [ParentCounselingSessionEntity])
  items!: ParentCounselingSessionEntity[];
}
