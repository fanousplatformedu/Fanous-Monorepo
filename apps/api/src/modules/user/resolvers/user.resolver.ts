import { Resolver, Mutation, Args, Query, Context } from "@nestjs/graphql";
import { CreateUserInput } from "@user/dto/user.input";
import { UpdateMeInput } from "@user/dto/update-user.input";
import { JwtAuthGuard } from "@guards/jwt-auth.guard";
import { UserService } from "@user/services/user.service";
import { QueryNames } from "@enums/gql-names.enum";
import { UserEntity } from "@user/entities/user.entity";
import { UseGuards } from "@nestjs/common";
import { Public } from "@decorators/public.decorator";

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Query(() => String, { name: QueryNames.HEALTH_CHECK })
  healthCheck(): string {
    return "GraphQL API is up and running!";
  }

  @Public()
  @Mutation(() => UserEntity, { name: QueryNames.CREATE_USER })
  async createUser(@Args("createUserInput") createUserInput: CreateUserInput) {
    return await this.userService.create(createUserInput);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => UserEntity, { name: QueryNames.ME })
  async me(@Context() ctx): Promise<UserEntity> {
    const userId = ctx.req.user.id;
    return this.userService.me(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => UserEntity, { name: QueryNames.UPDATE_ME })
  async updateMe(@Context() ctx, @Args("input") input: UpdateMeInput) {
    const userId = ctx.req.user.id;
    return this.userService.updateMe(userId, input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async enableGoogleCalendar(@Context() ctx) {
    const userId = ctx.req.user.id;
    await this.userService.setGoogleCalendar(userId, true);
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async disableGoogleCalendar(@Context() ctx) {
    const userId = ctx.req.user.id;
    await this.userService.setGoogleCalendar(userId, false);
    return true;
  }
}
