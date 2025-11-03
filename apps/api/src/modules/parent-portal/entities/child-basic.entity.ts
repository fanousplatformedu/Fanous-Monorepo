import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class ChildBasicEntity {
  @Field() name: string;
  @Field(() => ID) id: string;
  @Field({ nullable: true }) avatar?: string | null;
  @Field({ nullable: true }) gradeName?: string | null;
  @Field({ nullable: true }) classroomName?: string | null;
}
