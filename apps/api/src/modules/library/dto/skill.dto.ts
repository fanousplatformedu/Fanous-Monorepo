import { InputType, Field } from "@nestjs/graphql";

@InputType("CreateSkillInput")
export class CreateSkillInput {
  @Field() code: string;
  @Field() title: string;
  @Field({ nullable: true }) meta?: string;
  @Field({ nullable: true }) category?: string;
}

@InputType("UpdateSkillInput")
export class UpdateSkillInput {
  @Field() id: string;
  @Field({ nullable: true }) code?: string;
  @Field({ nullable: true }) meta?: string;
  @Field({ nullable: true }) title?: string;
  @Field({ nullable: true }) category?: string;
}

@InputType("UpsertSkillInput")
export class UpsertSkillInput {
  @Field() code: string;
  @Field() title: string;
  @Field({ nullable: true }) meta?: string;
  @Field({ nullable: true }) category?: string;
}

@InputType("BulkUpsertSkillsInput")
export class BulkUpsertSkillsInput {
  @Field(() => [UpsertSkillInput]) items: UpsertSkillInput[];
}
