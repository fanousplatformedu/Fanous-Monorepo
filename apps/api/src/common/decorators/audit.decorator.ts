import { SetMetadata, applyDecorators, UseInterceptors } from "@nestjs/common";
import { AuditInterceptor } from "@interceptors/audit.interceptors";

export const AUDIT_META = "audit:meta";

export function Audit(action: string, entity?: string) {
  return applyDecorators(
    SetMetadata(AUDIT_META, { action, entity }),
    UseInterceptors(AuditInterceptor)
  );
}
