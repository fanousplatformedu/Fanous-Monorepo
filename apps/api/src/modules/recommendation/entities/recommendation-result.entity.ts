import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class GenerateResult {
  @Field(() => Int) created: number;
}

@ObjectType()
export class PreviewPayload {
  @Field(() => String) tenantId: string;
  @Field(() => String) resultId: string;
  @Field(() => String) previewJson: string;
  @Field(() => String) assessmentId: string;
}
