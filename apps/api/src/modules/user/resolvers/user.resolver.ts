import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlQueryNames } from "@user/enums/gql-names.enum";
import { UpdateMeInput } from "@user/dto/update-user.input";
import { UserService } from "@user/services/user.service";
import { UserEntity } from "@user/entities/user.entity";
import { Public } from "@decorators/public.decorator";

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Public()
  @Query(() => String, { name: GqlQueryNames.USER_HEALTH_CHECK })
  userHealthCheck(): string {
    return "User module is OK";
  }

  @Query(() => UserEntity, { name: GqlQueryNames.USER_ME })
  me(@Context() ctx): Promise<UserEntity> {
    const userId: string = ctx.req.user.id;
    return this.userService.me(userId);
  }

  @Mutation(() => UserEntity, { name: GqlQueryNames.USER_UPDATE_ME })
  updateMe(
    @Context() ctx,
    @Args("input") input: UpdateMeInput,
  ): Promise<UserEntity> {
    const userId: string = ctx.req.user.id;
    return this.userService.updateMe(userId, input);
  }
}
