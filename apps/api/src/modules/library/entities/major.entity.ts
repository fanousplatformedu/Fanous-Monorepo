import { ObjectType, Field, ID, Int } from "@nestjs/graphql";

@ObjectType()
export class MajorEntity {
  @Field(() => ID) id: string;
  @Field(() => String) code: string;
  @Field(() => String) title: string;
  @Field(() => String, { nullable: true }) meta?: string | null;
  @Field(() => String, { nullable: true }) summary?: string | null;
  @Field(() => Int, { nullable: true }) skillsCount?: number | null;
}
