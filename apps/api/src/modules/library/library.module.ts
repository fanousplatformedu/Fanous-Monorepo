import { LibraryResolver } from "@library/resolvers/library.resolver";
import { LibraryService } from "@library/services/library.service";
import { PrismaModule } from "@prisma/prisma.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule],
  providers: [LibraryService, LibraryResolver],
  exports: [LibraryService],
})
export class LibraryModule {}
