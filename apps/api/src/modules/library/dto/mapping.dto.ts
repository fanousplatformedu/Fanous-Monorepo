import { InputType, Field } from "@nestjs/graphql";

@InputType("SetCareerSkillsInput")
export class SetCareerSkillsInput {
  @Field() careerId: string;
  @Field() mappingJson: string;
}

@InputType("SetMajorSkillsInput")
export class SetMajorSkillsInput {
  @Field() majorId: string;
  @Field() mappingJson: string;
}

@InputType("SuggestSkillsInput")
export class SuggestSkillsInput {
  @Field() q: string;
  @Field({ nullable: true }) limit?: number;
  @Field({ nullable: true }) category?: string;
}
