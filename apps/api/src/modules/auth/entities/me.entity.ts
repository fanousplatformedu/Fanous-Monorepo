import { GlobalRole, SchoolRole } from "@prisma/client";
import { Field, ObjectType } from "@nestjs/graphql";
import { GqlEntityNames } from "@auth/enums/gql-names.enum";

@ObjectType(GqlEntityNames.ME)
export class MeEntity {
  @Field() id!: string;
  @Field() schoolId!: string;
  @Field({ nullable: true }) email?: string;
  @Field({ nullable: true }) phone?: string;
  @Field(() => String) globalRole!: GlobalRole;
  @Field(() => String) schoolRole!: SchoolRole;
}
