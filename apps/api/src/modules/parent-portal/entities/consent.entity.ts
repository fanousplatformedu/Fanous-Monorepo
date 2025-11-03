import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class ConsentEntity {
  @Field() type: string;
  @Field() status: string;
  @Field() createdAt: Date;
  @Field() updatedAt: Date;
  @Field(() => ID) id: string;
  @Field({ nullable: true }) data?: string | null;
}
