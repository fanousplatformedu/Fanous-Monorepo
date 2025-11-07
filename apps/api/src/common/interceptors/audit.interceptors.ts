import { CallHandler, Injectable, NestInterceptor } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ExecutionContext } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { AuditService } from "@audit/services/audit.service";
import { AUDIT_META } from "@decorators/audit.decorator";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private audit: AuditService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const meta = this.reflector.get<{ action: string; entity?: string }>(
      AUDIT_META,
      context.getHandler()
    );
    if (!meta) return next.handle();
    const type = context.getType<"http" | "graphql" | "ws">();
    let req: any;
    if (type === "graphql") {
      const g = GqlExecutionContext.create(context);
      req = g.getContext().req;
    } else {
      req = context.switchToHttp().getRequest();
    }

    const ip = (req?.ip || req?.socket?.remoteAddress || "") as string;
    const userAgent = req?.headers?.["user-agent"] as string | undefined;
    const actorId = req?.user?.id ?? null;
    const tenantId =
      req?.headers?.["x-tenant-id"] || req?.user?.tenantId || "public";
    return next.handle().pipe(
      tap(async (result) => {
        const entityId = (result?.id ?? result?.entityId ?? null) as
          | string
          | null;
        await this.audit.log({
          ip,
          actorId,
          action: meta.action,
          entity: meta.entity,
          data: { result: !!result },
          tenantId: String(tenantId),
          entityId: entityId ?? null,
          userAgent: userAgent ?? null,
        });
      })
    );
  }
}
