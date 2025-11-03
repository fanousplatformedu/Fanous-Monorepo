import { InputType, Field } from "@nestjs/graphql";

@InputType("CreateMajorInput")
export class CreateMajorInput {
  @Field() code: string;
  @Field() title: string;
  @Field({ nullable: true }) meta?: string;
  @Field({ nullable: true }) summary?: string;
}
@InputType("UpdateMajorInput")
export class UpdateMajorInput {
  @Field() id: string;
  @Field({ nullable: true }) code?: string;
  @Field({ nullable: true }) meta?: string;
  @Field({ nullable: true }) title?: string;
  @Field({ nullable: true }) summary?: string;
}
