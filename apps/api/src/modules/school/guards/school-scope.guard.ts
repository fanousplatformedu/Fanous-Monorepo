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
    if (!user) throw new AppError(SchoolCodes.UNAUTHORIZED as any);
    const gql = GqlExecutionContext.create(context);
    const args = gql.getArgs();
    const schoolId = this.extractSchoolId(args);
    if (!schoolId)
      throw new AppError(
        SchoolCodes.INVALID_INPUT as any,
        "schoolId is required",
      );

    if (
      policy.allowSuperAdminBypass &&
      user.globalRole === GlobalRole.SUPER_ADMIN
    ) {
      return this.ensureSchoolExistsAndMaybeActive(
        schoolId,
        policy.requireActive ?? true,
      );
    }
    if (user.schoolId !== schoolId)
      throw new AppError(SchoolCodes.FORBIDDEN as any);
    return this.ensureSchoolExistsAndMaybeActive(
      schoolId,
      policy.requireActive ?? true,
    );
  }

  private async ensureSchoolExistsAndMaybeActive(
    schoolId: string,
    requireActive: boolean,
  ) {
    const school = await this.prismaService.school.findUnique({
      where: { id: schoolId },
    });
    if (!school) throw new AppError(SchoolCodes.SCHOOL_NOT_FOUND as any);
    if (requireActive && !school.isActive)
      throw new AppError(SchoolCodes.SCHOOL_INACTIVE as any);
    return true;
  }

  private extractSchoolId(args: any): string | null {
    if (args?.input?.schoolId) return args.input.schoolId;
    if (args?.schoolId) return args.schoolId;
    return null;
  }

  private getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
