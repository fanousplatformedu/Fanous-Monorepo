import { InputType, Field } from "@nestjs/graphql";

@InputType("CreateSkillInput")
export class CreateSkillInput {
  @Field(() => String) code!: string;
  @Field(() => String) title!: string;
  @Field({ nullable: true }) meta?: string;
  @Field({ nullable: true }) category?: string;
}

@InputType("UpdateSkillInput")
export class UpdateSkillInput {
  @Field(() => String) id!: string;
  @Field({ nullable: true }) code?: string;
  @Field({ nullable: true }) meta?: string;
  @Field({ nullable: true }) title?: string;
  @Field({ nullable: true }) category?: string;
}

@InputType("UpsertSkillInput")
export class UpsertSkillInput {
  @Field(() => String) code!: string;
  @Field(() => String) title!: string;
  @Field({ nullable: true }) meta?: string;
  @Field({ nullable: true }) category?: string;
}

@InputType("BulkUpsertSkillsInput")
export class BulkUpsertSkillsInput {
  @Field(() => [UpsertSkillInput]) items!: UpsertSkillInput[];
}
