import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common";
import { FileStorageService } from "@file-storage/services/file-storage.service";
import { Role } from "@prisma/client";

// =========== Mocks for AWS SDK v3 + presigner ==============
const sendMock = jest.fn();
const S3ClientMock = jest.fn().mockImplementation(() => ({ send: sendMock }));
const PutObjectCommandMock = jest.fn(function PutObjectCommand(init) {
  Object.assign(this, init);
});
const DeleteObjectCommandMock = jest.fn(function DeleteObjectCommand(init) {
  Object.assign(this, init);
});
const GetObjectCommandMock = jest.fn(function GetObjectCommand(init) {
  Object.assign(this, init);
});

jest.mock("@aws-sdk/client-s3", () => {
  function PutObjectCommand(init?: any) {
    Object.assign(this, init);
  }
  function DeleteObjectCommand(init?: any) {
    Object.assign(this, init);
  }
  function GetObjectCommand(init?: any) {
    Object.assign(this, init);
  }
  return {
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
  };
});

const getSignedUrlMock = jest.fn();
jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: (...args: any[]) => getSignedUrlMock(...args),
}));

// ============== Deterministic + UUID ================
const NOW_FIX = 1730832000000;
const randomUUIDMock = jest.fn().mockReturnValue("uuid-1");
jest.mock("crypto", () => ({
  randomUUID: () => randomUUIDMock(),
}));

// ============ Minimal stubs for Prisma + S3Factory + Config ===========
const makePrismaMock = () => ({
  $transaction: jest.fn(),
  fileAsset: {
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
});

const makeS3FactoryMock = () => ({
  client: new S3ClientMock({}),
  bucket: "my-bucket",
  acl: "private",
  endpoint: "https://s3.amazonaws.com",
  region: "us-east-1",
  forcePathStyle: false,
});

const makeConfigMock = (overrides: Record<string, string> = {}) => ({
  get: (k: string) =>
    overrides[k] ??
    (
      {
        UPLOAD_MAX_SIZE_BYTES: "10485760",
        UPLOAD_ALLOWED_MIME: "image/png,image/jpeg,application/pdf",
        FILE_CDN_BASE_URL: "",
      } as any
    )[k],
});

type Actor = { id: string; role: Role };

describe("FileStorageService", () => {
  let service: FileStorageService;
  let prisma: ReturnType<typeof makePrismaMock>;
  let s3: ReturnType<typeof makeS3FactoryMock>;
  let cfg: ReturnType<typeof makeConfigMock>;

  const admin: Actor = { id: "a1", role: Role.ADMIN };
  const superAdmin: Actor = { id: "s1", role: Role.SUPER_ADMIN };
  const student: Actor = { id: "u1", role: Role.STUDENT };

  beforeAll(() => {
    jest.spyOn(Date, "now").mockReturnValue(NOW_FIX);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    prisma = makePrismaMock();
    s3 = makeS3FactoryMock();
    cfg = makeConfigMock();
    service = new FileStorageService(prisma as any, s3 as any, cfg as any);
    getSignedUrlMock.mockResolvedValue("https://signed.example.com/put");
  });

  // =============== presignUpload =====================
  describe("presignUpload", () => {
    it("throws if tenantId missing", async () => {
      await expect(
        service.presignUpload(
          {
            tenantId: "" as any,
            fileName: "x.png",
            mimeType: "image/png",
            sizeBytes: 100,
          } as any,
          admin
        )
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("rejects disallowed MIME", async () => {
      await expect(
        service.presignUpload(
          {
            tenantId: "t1",
            fileName: "x.exe",
            mimeType: "application/x-msdownload",
            sizeBytes: 100,
          },
          admin
        )
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("rejects oversized file", async () => {
      await expect(
        service.presignUpload(
          {
            tenantId: "t1",
            fileName: "x.pdf",
            mimeType: "application/pdf",
            sizeBytes: 10485761,
          },
          admin
        )
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("returns presigned info, builds deterministic key and PutObjectCommand", async () => {
      const res = await service.presignUpload(
        {
          tenantId: "t1",
          pathPrefix: "/unsafe/../path//",
          fileName: "file.Name.PnG",
          mimeType: "image/png",
          sizeBytes: 1234,
        },
        admin
      );

      expect(res.key).toMatch(
        /^tenants\/t1\/unsafe\/path\/1730832000000-uuid-1\.png$/
      );
      expect(res.fileId).toBe("uuid-1");
      expect(res.requiredContentType).toBe("image/png");
      expect(res.maxSizeBytes).toBe(10485760);
      expect(res.expiresInSec).toBe(300);
      expect(res.url).toBe("https://signed.example.com/put");
      expect(getSignedUrlMock).toHaveBeenCalledTimes(1);
      const [clientArg, cmdArg, optsArg] = (getSignedUrlMock as jest.Mock).mock
        .calls[0];
      expect(clientArg).toBe(s3.client);
      expect(cmdArg).toEqual(
        expect.objectContaining({
          Bucket: "my-bucket",
          Key: res.key,
          ACL: "private",
          ContentType: "image/png",
        })
      );
      expect(optsArg).toEqual(expect.objectContaining({ expiresIn: 300 }));
      expect(getSignedUrlMock).toHaveBeenCalledTimes(1);
    });
  });

  // =============== completeUpload ====================
  describe("completeUpload", () => {
    it("throws if tenantId missing", async () => {
      await expect(
        service.completeUpload(
          { fileId: "f1", tenantId: "", key: "k1" } as any,
          admin
        )
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("throws if key missing", async () => {
      await expect(
        service.completeUpload(
          { fileId: "f1", tenantId: "t1", key: "" } as any,
          admin
        )
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("validates when mime+size provided", async () => {
      await expect(
        service.completeUpload(
          {
            fileId: "f1",
            tenantId: "t1",
            key: "tenants/t1/a.bin",
            mimeType: "application/x-msdownload",
            sizeBytes: 12,
          },
          admin
        )
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("creates fileAsset with computed public URL and meta", async () => {
      prisma.fileAsset.create.mockResolvedValueOnce({
        id: "id-1",
        tenantId: "t1",
        key: "tenants/t1/x.pdf",
        url: "https://my-bucket.s3.amazonaws.com/tenants/t1/x.pdf",
        mimeType: "application/pdf",
        sizeBytes: 123,
        meta: { a: 1 },
        createdAt: new Date(NOW_FIX),
      });

      const out = await service.completeUpload(
        {
          fileId: "f1",
          tenantId: "t1",
          key: "tenants/t1/x.pdf",
          mimeType: "application/pdf",
          sizeBytes: 123,
          metaJson: '{"a":1}',
        },
        admin
      );

      expect(prisma.fileAsset.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          tenantId: "t1",
          key: "tenants/t1/x.pdf",
          url: "https://my-bucket.s3.amazonaws.com/tenants/t1/x.pdf",
          mimeType: "application/pdf",
          sizeBytes: 123,
          meta: { a: 1 },
        }),
      });

      expect(out).toEqual(
        expect.objectContaining({
          id: "id-1",
          tenantId: "t1",
          key: "tenants/t1/x.pdf",
          url: "https://my-bucket.s3.amazonaws.com/tenants/t1/x.pdf",
          mimeType: "application/pdf",
          sizeBytes: 123,
          meta: JSON.stringify({ a: 1 }),
          createdAt: new Date(NOW_FIX),
        })
      );
    });

    it("uses CDN base when configured", async () => {
      const cfg2 = makeConfigMock({ FILE_CDN_BASE_URL: "https://cdn.example" });
      const s2 = makeS3FactoryMock();
      const svc2 = new FileStorageService(
        prisma as any,
        s2 as any,
        cfg2 as any
      );

      prisma.fileAsset.create.mockResolvedValueOnce({
        id: "id-2",
        tenantId: "t1",
        key: "tenants/t1/x.pdf",
        url: "https://cdn.example/tenants/t1/x.pdf",
        mimeType: null,
        sizeBytes: null,
        meta: null,
        createdAt: new Date(NOW_FIX),
      });

      const out = await svc2.completeUpload(
        { fileId: "f1", tenantId: "t1", key: "tenants/t1/x.pdf" },
        admin
      );

      expect(prisma.fileAsset.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          url: "https://cdn.example/tenants/t1/x.pdf",
        }),
      });
      expect(out.url).toBe("https://cdn.example/tenants/t1/x.pdf");
    });
  });

  // =============== getDownloadUrl ====================
  describe("getDownloadUrl", () => {
    it("throws NotFound if file missing", async () => {
      prisma.fileAsset.findUnique.mockResolvedValueOnce(null);
      await expect(
        service.getDownloadUrl({ fileId: "missing" }, admin)
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("returns public URL when ACL is public-read and url exists", async () => {
      (s3 as any).acl = "public-read";
      service = new FileStorageService(prisma as any, s3 as any, cfg as any);
      prisma.fileAsset.findUnique.mockResolvedValueOnce({
        id: "f1",
        key: "tenants/t1/a.pdf",
        url: "https://cdn/public-url.pdf",
        mimeType: "application/pdf",
      });

      const out = await service.getDownloadUrl({ fileId: "f1" }, admin);
      expect(out).toBe("https://cdn/public-url.pdf");
      expect(getSignedUrlMock).not.toHaveBeenCalled();
    });

    it("presigns GetObject when ACL != public-read", async () => {
      prisma.fileAsset.findUnique.mockResolvedValueOnce({
        id: "f1",
        key: "tenants/t1/a.pdf",
        url: "https://my-bucket.s3.amazonaws.com/tenants/t1/a.pdf",
        mimeType: "application/pdf",
      });
      getSignedUrlMock.mockResolvedValueOnce("https://signed.get/url");
      const out = await service.getDownloadUrl(
        { fileId: "f1", asAttachmentName: "report.pdf", expiresInSec: 30 },
        admin
      );
      expect(getSignedUrlMock).toHaveBeenCalledTimes(1);
      const [clientArg, cmdArg, optsArg] = (getSignedUrlMock as jest.Mock).mock
        .calls[0];

      expect(clientArg).toBe(s3.client);
      expect(cmdArg).toEqual(
        expect.objectContaining({
          Bucket: "my-bucket",
          Key: "tenants/t1/a.pdf",
          ResponseContentDisposition: 'attachment; filename="report.pdf"',
          ResponseContentType: "application/pdf",
        })
      );
      expect(optsArg).toEqual(expect.objectContaining({ expiresIn: 60 }));
      expect(out).toBe("https://signed.get/url");
    });

    it("caps expiresIn to 3600 seconds max", async () => {
      prisma.fileAsset.findUnique.mockResolvedValueOnce({
        id: "f1",
        key: "tenants/t1/a.pdf",
        url: null,
        mimeType: null,
      });

      await service.getDownloadUrl(
        { fileId: "f1", expiresInSec: 999999 },
        admin
      );

      const params = (getSignedUrlMock as jest.Mock).mock.calls[0][2];
      expect(params.expiresIn).toBe(3600);
    });
  });

  // =============== deleteFile ========================
  describe("deleteFile", () => {
    it("throws NotFound if missing", async () => {
      prisma.fileAsset.findUnique.mockResolvedValueOnce(null);
      await expect(
        service.deleteFile({ fileId: "x" }, admin)
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("forbids non admins", async () => {
      prisma.fileAsset.findUnique.mockResolvedValueOnce({
        id: "f1",
        key: "tenants/t1/a.pdf",
      });
      await expect(
        service.deleteFile({ fileId: "f1" }, student)
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it("deletes from S3 then DB for admins", async () => {
      prisma.fileAsset.findUnique.mockResolvedValueOnce({
        id: "f1",
        key: "tenants/t1/a.pdf",
      });
      prisma.fileAsset.delete.mockResolvedValueOnce(true as any);
      sendMock.mockResolvedValueOnce({}); // S3 delete

      const ok = await service.deleteFile({ fileId: "f1" }, superAdmin);
      expect(sendMock).toHaveBeenCalledTimes(1);
      const [deleteArg] = sendMock.mock.calls[0];
      expect(deleteArg).toEqual(
        expect.objectContaining({
          Bucket: "my-bucket",
          Key: "tenants/t1/a.pdf",
        })
      );

      expect(prisma.fileAsset.delete).toHaveBeenCalledWith({
        where: { id: "f1" },
      });
      expect(ok).toBe(true);
    });
  });

  // =============== listFiles ========================
  describe("listFiles", () => {
    it("forbids non admins", async () => {
      await expect(
        service.listFiles({ tenantId: "t1", page: 1, pageSize: 20 }, student)
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it("returns page with items + stringified meta; applies q filter", async () => {
      const items = [
        {
          id: "f1",
          tenantId: "t1",
          key: "tenants/t1/a.pdf",
          url: "https://u/a.pdf",
          mimeType: "application/pdf",
          sizeBytes: 123,
          meta: { x: 1 },
          createdAt: new Date(NOW_FIX),
        },
        {
          id: "f2",
          tenantId: "t1",
          key: "tenants/t1/b.png",
          url: "https://u/b.png",
          mimeType: "image/png",
          sizeBytes: 999,
          meta: null,
          createdAt: new Date(NOW_FIX),
        },
      ];

      prisma.$transaction.mockImplementation(async (arg: any) => {
        if (typeof arg === "function") {
          const tx = {
            fileAsset: prisma.fileAsset,
          };
          return await arg(tx);
        }
        if (Array.isArray(arg)) {
          const arr = arg as Array<Promise<any>>;
          const results = await Promise.all(arr);
          return results;
        }
        return undefined;
      });
      prisma.fileAsset.findMany.mockResolvedValueOnce(items as any);
      prisma.fileAsset.count.mockResolvedValueOnce(42);
      const out = await service.listFiles(
        { tenantId: "t1", q: "a.", page: 2, pageSize: 10 },
        admin
      );

      expect(prisma.fileAsset.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              { tenantId: "t1" },
              expect.objectContaining({
                OR: expect.arrayContaining([
                  { key: { contains: "a.", mode: "insensitive" } },
                  { url: { contains: "a.", mode: "insensitive" } },
                ]),
              }),
            ]),
          }),
          orderBy: { createdAt: "desc" },
          skip: 10,
          take: 10,
        })
      );

      expect(out.total).toBe(42);
      expect(out.page).toBe(2);
      expect(out.pageSize).toBe(10);
      expect(out.items[0].meta).toBe(JSON.stringify({ x: 1 }));
      expect(out.items[1].meta).toBeNull();
    });
  });
});
