import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { IS_PUBLIC_KEY } from "@auth/decorators/public.decorator";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "@auth/decorators/roles.decorator";
import { Role } from "@prisma/client";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;

    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!roles || roles.length === 0) return true;

    const gqlCtx = GqlExecutionContext.create(ctx);
    const req = gqlCtx.getContext().req;
    const user = req.user as { role?: Role } | undefined;

    return !!user?.role && roles.includes(user.role);
  }
}
