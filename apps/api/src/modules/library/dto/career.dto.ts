import { InputType, Field } from "@nestjs/graphql";

@InputType("CreateCareerInput")
export class CreateCareerInput {
  @Field() code: string;
  @Field() title: string;
  @Field({ nullable: true }) meta?: string;
  @Field({ nullable: true }) summary?: string;
}
@InputType("UpdateCareerInput")
export class UpdateCareerInput {
  @Field() id: string;
  @Field({ nullable: true }) meta?: string;
  @Field({ nullable: true }) code?: string;
  @Field({ nullable: true }) title?: string;
  @Field({ nullable: true }) summary?: string;
}
