import { ConsentResolver } from "./resolvers/consent.resolver";
import { ConsentService } from "./services/consent.service";
import { PrismaModule } from "@prisma/prisma.module";
import { Module } from "@nestjs/common";

import "./enums/consent.enums";

@Module({
  imports: [PrismaModule],
  providers: [ConsentResolver, ConsentService],
  exports: [ConsentService],
})
export class ConsentModule {}
