import { InputType, Field } from "@nestjs/graphql";

@InputType("SetCareerSkillsInput")
export class SetCareerSkillsInput {
  @Field(() => String) careerId!: string;
  @Field(() => String) mappingJson!: string;
}

@InputType("SetMajorSkillsInput")
export class SetMajorSkillsInput {
  @Field(() => String) majorId!: string;
  @Field(() => String) mappingJson!: string;
}

@InputType("SuggestSkillsInput")
export class SuggestSkillsInput {
  @Field(() => String) q!: string;
  @Field({ nullable: true }) limit?: number;
  @Field({ nullable: true }) category?: string;
}
