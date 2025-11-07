import { BillingController } from "@billing/controllers/billing.controllers";
import { BillingResolver } from "@billing/resolvers/billing.resolver";
import { BillingService } from "@billing/services/billing.service";
import { PrismaModule } from "@prisma/prisma.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule],
  providers: [BillingService, BillingResolver],
  controllers: [BillingController],
  exports: [BillingService],
})
export class BillingModule {}
