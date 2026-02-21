import { MembershipResolver } from "@membership/resolvers/membership.resolver";
import { MembershipService } from "@membership/services/membership.service";
import { PrismaModule } from "@prisma/prisma.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule],
  providers: [MembershipResolver, MembershipService],
  exports: [MembershipService],
})
export class MembershipModule {}
