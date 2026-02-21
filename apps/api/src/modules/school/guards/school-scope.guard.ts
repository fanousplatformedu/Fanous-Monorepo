import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { SchoolScopePolicy } from "@school/decorators/school-scope.decorator";
import { SCHOOL_SCOPE_KEY } from "@school/decorators/school-scope.decorator";
import { PrismaService } from "@prisma/prisma.service";
import { SchoolCodes } from "@school/enums/school-codes.enum";
import { GlobalRole } from "@prisma/client";
import { Reflector } from "@nestjs/core";
import { AppError } from "@ctypes/app-error";

@Injectable()
export class SchoolScopeGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policy = this.reflector.getAllAndOverride<SchoolScopePolicy>(
      SCHOOL_SCOPE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!policy) return true;
    const req = this.getRequest(context);
    const user = req.user;
    if (!user)
      throw new AppError(SchoolCodes.UNAUTHORIZED as any, "UNAUTHORIZED", 401);
    const gql = GqlExecutionContext.create(context);
    const args = gql.getArgs();
    const schoolId = this.pickSchoolId(policy, user, args);
    if (!schoolId) {
      throw new AppError(
        SchoolCodes.INVALID_INPUT as any,
        "schoolId is required",
        400,
      );
    }
    if (
      policy.allowSuperAdminBypass !== false &&
      user.globalRole === GlobalRole.SUPER_ADMIN
    ) {
      return this.ensureSchoolExistsAndMaybeActive(
        schoolId,
        policy.requireActive ?? true,
      );
    }
    if (!user.schoolId || user.schoolId !== schoolId)
      throw new AppError(SchoolCodes.FORBIDDEN as any, "FORBIDDEN", 403);
    return this.ensureSchoolExistsAndMaybeActive(
      schoolId,
      policy.requireActive ?? true,
    );
  }

  private pickSchoolId(
    policy: SchoolScopePolicy,
    user: any,
    args: any,
  ): string | null {
    const fromToken = user?.schoolId ?? null;
    const fromArgs = this.extractSchoolId(args);
    const source = policy.source ?? "token_or_args";
    if (source === "token") return fromToken;
    if (source === "args") return fromArgs;
    return fromToken ?? fromArgs ?? null;
  }

  private async ensureSchoolExistsAndMaybeActive(
    schoolId: string,
    requireActive: boolean,
  ) {
    const school = await this.prismaService.school.findUnique({
      where: { id: schoolId },
      select: { id: true, isActive: true },
    });
    if (!school)
      throw new AppError(
        SchoolCodes.SCHOOL_NOT_FOUND as any,
        "SCHOOL_NOT_FOUND",
        404,
      );
    if (requireActive && !school.isActive)
      throw new AppError(
        SchoolCodes.SCHOOL_INACTIVE as any,
        "SCHOOL_INACTIVE",
        403,
      );
    return true;
  }

  private extractSchoolId(args: any): string | null {
    if (args?.input?.schoolId) return args.input.schoolId;
    if (args?.schoolId) return args.schoolId;
    if (args?.where?.schoolId) return args.where.schoolId;
    if (args?.input?.where?.schoolId) return args.input.where.schoolId;
    if (args?.data?.schoolId) return args.data.schoolId;
    if (args?.input?.data?.schoolId) return args.input.data.schoolId;
    return null;
  }

  private getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
