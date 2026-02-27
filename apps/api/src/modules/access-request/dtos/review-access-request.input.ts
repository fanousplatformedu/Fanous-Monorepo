import { IsBoolean, IsEnum, IsString } from "class-validator";
import { AccessRequestGqlInputNames } from "@accessRequest/enums/gql-names.enum";
import { IsNotEmpty, IsOptional } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { NotifyVia } from "@accessRequest/enums/notify-via.enum";
import { Role } from "@prisma/client";

@InputType(AccessRequestGqlInputNames.ReviewAccessRequestInput)
export class ReviewAccessRequestInput {
  @Field() @IsBoolean() approve!: boolean;
  @Field() @IsString() @IsNotEmpty() requestId!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() rejectReason?: string;
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(Role)
  finalRole?: Role;
  @Field(() => String, { nullable: true, defaultValue: "AUTO" })
  @IsOptional()
  @IsEnum(NotifyVia)
  notifyVia?: NotifyVia;
}
