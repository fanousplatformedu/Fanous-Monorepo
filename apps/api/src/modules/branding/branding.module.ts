import { BrandingResolver } from "@branding/resolvers/branding.resolver";
import { BrandingService } from "@branding/services/branding.service";
import { PrismaModule } from "@prisma/prisma.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule],
  providers: [BrandingService, BrandingResolver],
  exports: [BrandingService],
})
export class BrandingModule {}
