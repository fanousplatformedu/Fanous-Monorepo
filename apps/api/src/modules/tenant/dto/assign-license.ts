import { InputType, Field, ID, Int } from "@nestjs/graphql";
import { IsInt, IsOptional, Min } from "class-validator";
import { LicensePlan } from "@tenant/enums/tenant.enums";

@InputType("AssignLicenseInput")
export class AssignLicenseInput {
  @Field(() => ID) tenantId!: string;
  @Field(() => Date) startsAt!: Date;
  @Field(() => LicensePlan) plan!: LicensePlan;
  @Field(() => Int) @IsInt() @Min(1) seats!: number;
  @Field(() => Date, { nullable: true }) @IsOptional() endsAt?: Date;
}
