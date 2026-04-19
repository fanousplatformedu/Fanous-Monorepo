import { Field, Float, ObjectType } from "@nestjs/graphql";
import { ParentGqlObjectNames } from "@parent/enums/gql-names.enum";
import { IntelligenceKey } from "@prisma/client";

@ObjectType(ParentGqlObjectNames.ParentCompareResultItem)
export class ParentCompareResultItemEntity {
  @Field(() => Float) delta!: number;
  @Field(() => Float) current!: number;
  @Field(() => Float) previous!: number;
  @Field(() => IntelligenceKey) intelligence!: IntelligenceKey;
}
