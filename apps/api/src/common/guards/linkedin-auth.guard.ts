import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LinkedInAuthGuard extends AuthGuard("linkedin") {
  getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const role = (req.query?.role ?? "").toString();
    return { state: role || undefined };
  }
}
