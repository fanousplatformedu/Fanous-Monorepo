import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { IS_PUBLIC_KEY } from "@auth/decorators/public.decorator";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    return gqlCtx.getContext().req;
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context) as any;
  }
}
