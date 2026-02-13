import { InputType, Field } from "@nestjs/graphql";

@InputType("CreateMajorInput")
export class CreateMajorInput {
  @Field(() => String) code!: string;
  @Field(() => String) title!: string;
  @Field({ nullable: true }) meta?: string;
  @Field({ nullable: true }) summary?: string;
}
@InputType("UpdateMajorInput")
export class UpdateMajorInput {
  @Field(() => String) id!: string;
  @Field({ nullable: true }) code?: string;
  @Field({ nullable: true }) meta?: string;
  @Field({ nullable: true }) title?: string;
  @Field({ nullable: true }) summary?: string;
}
