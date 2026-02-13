import { ObjectType, Field, ID, Int } from "@nestjs/graphql";

@ObjectType()
export class ClassroomEntity {
  @Field(() => ID) id!: string;
  @Field(() => Int) year!: number;
  @Field(() => String) name!: string;
  @Field(() => Date) updatedAt!: Date;
  @Field(() => Date) createdAt!: Date;
  @Field(() => String) gradeId!: string;
  @Field(() => String) tenantId!: string;
  @Field(() => String, { nullable: true }) code?: string | null;
  @Field(() => Date, { nullable: true }) deletedAt?: Date | null;
}
