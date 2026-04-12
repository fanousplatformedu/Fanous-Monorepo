import { ALLOW_FORCE_PASSWORD_CHANGE_KEY } from "@superAdmin/decorators/allow-force-password-change.decorator";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { CanActivate, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";

@Injectable()
export class ForcePasswordChangeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(ctx: ExecutionContext): boolean {
    const allow = this.reflector.getAllAndOverride<boolean>(
      ALLOW_FORCE_PASSWORD_CHANGE_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    if (allow) return true;
    const gqlCtx = GqlExecutionContext.create(ctx);
    const req = gqlCtx.getContext().req;
    const user = req.user as
      | { role?: Role; forcePasswordChange?: boolean }
      | undefined;
    if (!user) return true;
    const isAdmin =
      user.role === Role.SCHOOL_ADMIN || user.role === Role.SUPER_ADMIN;
    if (!isAdmin) return true;
    if (user.forcePasswordChange)
      throw new ForbiddenException({
        code: "FORCE_PASSWORD_CHANGE_REQUIRED",
        message:
          "You must change your password before accessing this resource.",
      });
    return true;
  }
}
