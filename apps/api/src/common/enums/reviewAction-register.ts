import { registerEnumType } from "@nestjs/graphql";

export enum ReviewAction {
  REJECT = "REJECT",
  APPROVE = "APPROVE",
}

registerEnumType(ReviewAction, { name: "ReviewAction" });
