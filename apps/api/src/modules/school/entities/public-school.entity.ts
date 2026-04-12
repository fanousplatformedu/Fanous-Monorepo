import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PublicSchoolEntity {
  @Field() id!: string;
  @Field() name!: string;
  @Field(() => String, { nullable: true }) code?: string | null;
}
