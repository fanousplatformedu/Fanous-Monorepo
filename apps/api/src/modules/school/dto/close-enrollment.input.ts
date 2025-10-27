import { InputType, Field, ID } from "@nestjs/graphql";

@InputType("CloseEnrollmentInput")
export class CloseEnrollmentInput {
  @Field() tenantId: string;
  @Field(() => ID) id: string;
  @Field(() => Date, { nullable: true }) endedAt?: Date;
}
