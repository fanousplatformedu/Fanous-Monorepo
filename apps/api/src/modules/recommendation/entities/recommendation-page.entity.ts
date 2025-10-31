import { ObjectType, Field, Int } from "@nestjs/graphql";
import { RecommendationEntity } from "@recommendation/entities/recommendation.entity";

@ObjectType()
export class RecommendationPageEntity {
  @Field(() => Int) page: number;
  @Field(() => Int) total: number;
  @Field(() => Int) pageSize: number;
  @Field(() => [RecommendationEntity]) items: RecommendationEntity[];
}
