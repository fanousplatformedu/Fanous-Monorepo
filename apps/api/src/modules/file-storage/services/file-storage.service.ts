import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Injectable, BadRequestException } from "@nestjs/common";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { S3FactoryService } from "@file-storage/services/s3.service";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "@prisma/prisma.service";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { Role } from "@prisma/client";

type Actor = { id: string; role: Role };

@Injectable()
export class FileStorageService {
  private maxSize: number;
  private allowed: Set<string>;
  private cdnBase?: string;
  private acl: string;

  constructor(
    private prismaService: PrismaService,
    private s3Service: S3FactoryService,
    private configService: ConfigService
  ) {
    this.maxSize = parseInt(
      this.configService.get<string>("UPLOAD_MAX_SIZE_BYTES") || "10485760",
      10
    );
    this.allowed = new Set(
      (
        this.configService.get<string>("UPLOAD_ALLOWED_MIME") ||
        "image/png,image/jpeg,application/pdf"
      )
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    );
    this.cdnBase = this.configService.get<string>("FILE_CDN_BASE_URL") || "";
    this.acl = this.s3Service.acl;
  }

  private canManageTenant(actor: Actor) {
    const r = String(actor.role).toUpperCase();
    return ["SUPER_ADMIN", "SCHOOL_ADMIN", "ADMIN"].includes(r);
  }

  private ensureAllowed(mime: string, size: number) {
    const okMime =
      this.allowed.size === 0 || this.allowed.has(mime.toLowerCase());
    if (!okMime) throw new BadRequestException("MIME type not allowed");
    if (size > this.maxSize)
      throw new BadRequestException(`File too large (>${this.maxSize} bytes)`);
  }

  private extOf(name: string) {
    const i = name.lastIndexOf(".");
    return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
  }

  private buildKey(
    tenantId: string,
    pathPrefix: string | undefined,
    fileName: string
  ) {
    const ext = this.extOf(fileName);
    const safePrefix = pathPrefix
      ? pathPrefix
          .replace(/^\/+/, "")
          .replace(/\.\./g, "")
          .replace(/\/{2,}/g, "/")
      : "";
    const prefix = safePrefix ? `${safePrefix.replace(/\/+$/, "")}/` : "";
    return `tenants/${tenantId}/${prefix}${Date.now()}-${randomUUID()}.${ext || "bin"}`;
  }

  private publicUrlForKey(key: string) {
    if (this.cdnBase) return `${this.cdnBase.replace(/\/+$/, "")}/${key}`;
    if (this.s3Service.forcePathStyle)
      return `${this.s3Service.endpoint.replace(/\/+$/, "")}/${this.s3Service.bucket}/${key}`;
    const host = new URL(this.s3Service.endpoint).host;
    return `https://${this.s3Service.bucket}.${host}/${key}`;
  }

  async presignUpload(
    input: {
      tenantId: string;
      pathPrefix?: string;
      fileName: string;
      mimeType: string;
      sizeBytes: number;
    },
    actor: Actor
  ) {
    if (!input.tenantId) throw new BadRequestException("tenantId required");
    this.ensureAllowed(input.mimeType, input.sizeBytes);
    const key = this.buildKey(input.tenantId, input.pathPrefix, input.fileName);
    const put = new PutObjectCommand({
      Bucket: this.s3Service.bucket,
      Key: key,
      ACL: this.acl as any,
      ContentType: input.mimeType,
    });
    const expiresInSec = 60 * 5;
    const url = await getSignedUrl(this.s3Service.client, put, {
      expiresIn: expiresInSec,
    });
    const fileId = randomUUID();
    return {
      fileId,
      key,
      url,
      requiredContentType: input.mimeType,
      maxSizeBytes: this.maxSize,
      expiresInSec,
    };
  }

  async completeUpload(
    input: {
      fileId: string;
      tenantId: string;
      key: string;
      mimeType?: string;
      sizeBytes?: number;
      metaJson?: string;
    },
    actor: Actor
  ) {
    if (!input.tenantId) throw new BadRequestException("tenantId required");
    if (!input.key) throw new BadRequestException("key required");
    if (input.mimeType && input.sizeBytes)
      this.ensureAllowed(input.mimeType, input.sizeBytes);
    const url = this.publicUrlForKey(input.key);
    const meta = input.metaJson ? JSON.parse(input.metaJson) : undefined;

    const fa = await this.prismaService.fileAsset.create({
      data: {
        tenantId: input.tenantId,
        key: input.key,
        url,
        mimeType: input.mimeType || null,
        sizeBytes: input.sizeBytes || null,
        meta: meta,
      },
    });

    return {
      id: fa.id,
      tenantId: fa.tenantId,
      key: fa.key,
      url: fa.url,
      mimeType: fa.mimeType,
      sizeBytes: fa.sizeBytes,
      meta: fa.meta ? JSON.stringify(fa.meta) : null,
      createdAt: fa.createdAt,
    };
  }

  async getDownloadUrl(
    input: { fileId: string; expiresInSec?: number; asAttachmentName?: string },
    actor: Actor
  ) {
    const f = await this.prismaService.fileAsset.findUnique({
      where: { id: input.fileId },
    });
    if (!f) throw new NotFoundException("File not found");
    const cd = input.asAttachmentName
      ? `attachment; filename="${input.asAttachmentName}"`
      : undefined;
    if (this.acl === "public-read" && f.url) return f.url;
    const get = new GetObjectCommand({
      Bucket: this.s3Service.bucket,
      Key: f.key,
      ResponseContentDisposition: cd,
      ResponseContentType: f.mimeType || undefined,
    });
    const url = await getSignedUrl(this.s3Service.client, get, {
      expiresIn: Math.min(Math.max(input.expiresInSec || 300, 60), 60 * 60),
    });
    return url;
  }

  async deleteFile(input: { fileId: string }, actor: Actor) {
    const f = await this.prismaService.fileAsset.findUnique({
      where: { id: input.fileId },
    });
    if (!f) throw new NotFoundException("File not found");
    if (!this.canManageTenant(actor))
      throw new ForbiddenException("Access denied");
    await this.s3Service.client.send(
      new DeleteObjectCommand({ Bucket: this.s3Service.bucket, Key: f.key })
    );
    await this.prismaService.fileAsset.delete({ where: { id: input.fileId } });
    return true;
  }

  async listFiles(
    input: { tenantId: string; q?: string; page: number; pageSize: number },
    actor: Actor
  ) {
    if (!this.canManageTenant(actor))
      throw new ForbiddenException("Access denied");
    const AND: any[] = [{ tenantId: input.tenantId }];
    if (input.q) {
      AND.push({
        OR: [
          { key: { contains: input.q, mode: "insensitive" } },
          { url: { contains: input.q, mode: "insensitive" } },
        ],
      });
    }
    const where: any = { AND };
    const page = Math.max(1, input.page || 1);
    const pageSize = Math.min(100, Math.max(1, input.pageSize || 20));
    const skip = (page - 1) * pageSize;
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.fileAsset.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      this.prismaService.fileAsset.count({ where }),
    ]);
    return {
      items: (items as any[]).map((it) => ({
        ...it,
        meta: it.meta ? JSON.stringify(it.meta) : null,
      })),
      total,
      page,
      pageSize,
    };
  }
}
