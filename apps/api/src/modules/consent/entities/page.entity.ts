import { ObjectType, Field, Int } from "@nestjs/graphql";
import { ConsentEntity } from "@consent/entities/consent.entity";

@ObjectType()
export class ConsentPageEntity {
  @Field(() => Int) page: number;
  @Field(() => Int) total: number;
  @Field(() => Int) pageSize: number;
  @Field(() => [ConsentEntity]) items: ConsentEntity[];
}
