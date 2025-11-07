import { Resolver, Mutation, Args, Query, Context } from "@nestjs/graphql";
import { PresignedUploadEntity } from "@file-storage/entities/presign.entity";
import { GetDownloadUrlInput } from "@file-storage/dto/get-download-url.input";
import { CompleteUploadInput } from "@file-storage/dto/complete-upload.input";
import { FileStorageService } from "@file-storage/services/file-storage.service";
import { PresignUploadInput } from "@file-storage/dto/presign-upload.input";
import { Role, TenantRole } from "@prisma/client";
import { DeleteFileInput } from "@file-storage/dto/delete-file.input";
import { FileAssetEntity } from "@file-storage/entities/file.entity";
import { ListFilesInput } from "@file-storage/dto/list-files.input";
import { FileAssetPage } from "@file-storage/entities/file-asset.entity";
import { Roles } from "@decorators/roles.decorator";

@Resolver()
export class FileStorageResolver {
  constructor(private readonly fileStorageService: FileStorageService) {}

  // Option 1
  @Mutation(() => PresignedUploadEntity, { name: "presignUpload" })
  presignUpload(@Args("input") input: PresignUploadInput, @Context() ctx) {
    return this.fileStorageService.presignUpload(input, ctx.req.user);
  }

  // Option 2
  @Mutation(() => FileAssetEntity, { name: "completeUpload" })
  completeUpload(@Args("input") input: CompleteUploadInput, @Context() ctx) {
    return this.fileStorageService.completeUpload(input, ctx.req.user);
  }

  @Query(() => String, { name: "getDownloadUrl" })
  getDownloadUrl(@Args("input") input: GetDownloadUrlInput, @Context() ctx) {
    return this.fileStorageService.getDownloadUrl(input, ctx.req.user);
  }

  @Roles(Role.SUPER_ADMIN, TenantRole.SCHOOL_ADMIN, Role.ADMIN)
  @Mutation(() => Boolean, { name: "deleteFile" })
  deleteFile(@Args("input") input: DeleteFileInput, @Context() ctx) {
    return this.fileStorageService.deleteFile(input, ctx.req.user);
  }

  @Roles(Role.SUPER_ADMIN, TenantRole.SCHOOL_ADMIN, Role.ADMIN)
  @Query(() => FileAssetPage, { name: "listFiles" })
  listFiles(@Args("input") input: ListFilesInput, @Context() ctx) {
    const page = Math.max(1, input.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, input.pageSize ?? 20));
    return this.fileStorageService.listFiles(
      { ...input, page, pageSize },
      ctx.req.user
    );
  }
}
