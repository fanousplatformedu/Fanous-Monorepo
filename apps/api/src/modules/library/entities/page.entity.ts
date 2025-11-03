import { ObjectType, Field, Int } from "@nestjs/graphql";
import { CareerEntity } from "./career.entity";
import { SkillEntity } from "./skill.entity";
import { MajorEntity } from "./major.entity";

@ObjectType()
export class SkillPageEntity {
  @Field(() => Int) page: number;
  @Field(() => Int) total: number;
  @Field(() => Int) pageSize: number;
  @Field(() => [SkillEntity]) items: SkillEntity[];
}
@ObjectType()
export class CareerPageEntity {
  @Field(() => Int) page: number;
  @Field(() => Int) total: number;
  @Field(() => Int) pageSize: number;
  @Field(() => [CareerEntity]) items: CareerEntity[];
}
@ObjectType()
export class MajorPageEntity {
  @Field(() => Int) page: number;
  @Field(() => Int) total: number;
  @Field(() => Int) pageSize: number;
  @Field(() => [MajorEntity]) items: MajorEntity[];
}
