import { FileStorageResolver } from "@file-storage/resolvers/file-storage.resolver";
import { FileStorageService } from "@file-storage/services/file-storage.service";
import { S3FactoryService } from "@file-storage/services/s3.service";
import { PrismaModule } from "@prisma/prisma.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule],
  providers: [S3FactoryService, FileStorageService, FileStorageResolver],
  exports: [FileStorageService],
})
export class FileStorageModule {}
