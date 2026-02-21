import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ROLES_KEY, RolesPolicy, RoleValue } from "@decorators/roles.decorator";
import { isGlobalRole, isSchoolRole } from "@common/utils/guard-helper";
import { GqlExecutionContext } from "@nestjs/graphql";
import { GlobalRole } from "@prisma/client";
import { Reflector } from "@nestjs/core";
import { AuthCodes } from "@auth/enums/auth-errors.enum";
import { AppError } from "@ctypes/app-error";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const policy = this.reflector.getAllAndOverride<RolesPolicy>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!policy || !policy.roles?.length) return true;
    const req = this.getRequest(context);
    const user = req.user;
    if (!user) throw new AppError(AuthCodes.UNAUTHORIZED);
    const checks = policy.roles.map((r) => this.matchRole(user, r));
    if ((policy.mode ?? "ANY") === "ALL") {
      if (checks.every(Boolean)) return true;
      throw new AppError(AuthCodes.UNAUTHORIZED, AuthCodes.UNAUTHORIZED, 403, {
        required: policy.roles,
      });
    }
    if (checks.some(Boolean)) return true;
    throw new AppError(AuthCodes.UNAUTHORIZED, AuthCodes.UNAUTHORIZED, 403, {
      required: policy.roles,
    });
  }

  private matchRole(user: any, required: RoleValue): boolean {
    if (user.globalRole === GlobalRole.SUPER_ADMIN) return true;
    if (isGlobalRole(required)) return user.globalRole === required;
    if (isSchoolRole(required)) return user.schoolRole === required;
    return false;
  }

  private getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
