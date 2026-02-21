import { registerEnumType } from "@nestjs/graphql";

export enum LoginAs {
  SCHOOL_ADMIN = "SCHOOL_ADMIN",
  USER = "USER",
}

registerEnumType(LoginAs, { name: "LoginAs" });
