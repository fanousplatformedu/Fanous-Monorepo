import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class GradeEntity {
  @Field(() => ID) id: string;
  @Field(() => String) name: string;
  @Field(() => Date) createdAt: Date;
  @Field(() => Date) updatedAt: Date;
  @Field(() => String) tenantId: string;
  @Field(() => String, { nullable: true }) code?: string | null;
  @Field(() => Date, { nullable: true }) deletedAt?: Date | null;
}
