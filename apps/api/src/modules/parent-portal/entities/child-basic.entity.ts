import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class ChildBasicEntity {
  @Field(() => ID) id!: string;
  @Field(() => String) name!: string;
  @Field(() => String, { nullable: true }) avatar?: string | null;
  @Field(() => String, { nullable: true }) gradeName?: string | null;
  @Field(() => String, { nullable: true }) classroomName?: string | null;
}
