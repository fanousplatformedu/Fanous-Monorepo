import { ForbiddenException, Injectable } from "@nestjs/common";
import { ExecutionContext, CanActivate } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { IS_PUBLIC_KEY } from "@decorators/public.decorator";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "@decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (!requiredRoles || requiredRoles.length === 0) return true;
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req?.user;
    const allowed = requiredRoles.map((r) => String(r).toUpperCase());
    const userRole = String(user?.role ?? "").toUpperCase();
    const ok = allowed.includes(userRole);
    if (!ok)
      throw new ForbiddenException("Access denied: insufficient permissions");
    return true;
  }
}
