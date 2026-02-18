import { MembershipResolver } from "@membership/resolvers/membership.resolver";
import { MembershipService } from "@membership/services/membership.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [MembershipResolver, MembershipService],
  exports: [MembershipService],
})
export class MembershipModule {}
