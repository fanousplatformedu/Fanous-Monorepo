import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class ResponseEntity {
  @Field(() => ID) id!: string;
  @Field(() => String) value!: string;
  @Field(() => Date) createdAt!: Date;
  @Field(() => String) tenantId!: string;
  @Field(() => String) questionId!: string;
  @Field(() => String) assessmentId!: string;
}
