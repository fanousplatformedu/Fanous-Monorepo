import { Field, Int, ObjectType } from "@nestjs/graphql";
import { UserGqlObjectNames } from "@user/enums/gql-names.enum";
import { UserEntity } from "@user/entities/user.entity";

@ObjectType(UserGqlObjectNames.UserList)
export class UserListEntity {
  @Field(() => Int) skip!: number;
  @Field(() => Int) take!: number;
  @Field(() => Int) total!: number;
  @Field(() => [UserEntity]) items!: UserEntity[];
}
