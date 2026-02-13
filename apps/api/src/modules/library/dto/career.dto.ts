import { InputType, Field } from "@nestjs/graphql";

@InputType("CreateCareerInput")
export class CreateCareerInput {
  @Field(() => String) code!: string;
  @Field(() => String) title!: string;
  @Field({ nullable: true }) meta?: string;
  @Field({ nullable: true }) summary?: string;
}
@InputType("UpdateCareerInput")
export class UpdateCareerInput {
  @Field(() => String) id!: string;
  @Field({ nullable: true }) meta?: string;
  @Field({ nullable: true }) code?: string;
  @Field({ nullable: true }) title?: string;
  @Field({ nullable: true }) summary?: string;
}
