import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class SkillEntity {
  @Field(() => ID) id!: string;
  @Field(() => String) code!: string;
  @Field(() => String) title!: string;
  @Field(() => String, { nullable: true }) meta?: string | null;
  @Field(() => String, { nullable: true }) category?: string | null;
}
