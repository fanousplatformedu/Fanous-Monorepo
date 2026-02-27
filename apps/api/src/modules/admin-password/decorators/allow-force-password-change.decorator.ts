import { SetMetadata } from "@nestjs/common";

export const ALLOW_FORCE_PASSWORD_CHANGE_KEY = "allowForcePasswordChange";

export const AllowForcePasswordChange = () =>
  SetMetadata(ALLOW_FORCE_PASSWORD_CHANGE_KEY, true);
