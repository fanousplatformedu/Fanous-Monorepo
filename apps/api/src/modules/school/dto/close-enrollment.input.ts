import { InputType, Field, ID } from "@nestjs/graphql";

@InputType("CloseEnrollmentInput")
export class CloseEnrollmentInput {
  @Field(() => ID) id!: string;
  @Field(() => String) tenantId!: string;
  @Field(() => Date, { nullable: true }) endedAt?: Date;
}
