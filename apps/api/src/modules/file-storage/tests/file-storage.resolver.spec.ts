import { FileStorageResolver } from "@file-storage/resolvers/file-storage.resolver";
import { FileStorageService } from "@file-storage/services/file-storage.service";
import { Test } from "@nestjs/testing";
import { Role } from "@prisma/client";

describe("FileStorageResolver", () => {
  let resolver: FileStorageResolver;
  const service = {
    presignUpload: jest.fn(),
    completeUpload: jest.fn(),
    getDownloadUrl: jest.fn(),
    deleteFile: jest.fn(),
    listFiles: jest.fn(),
  };

  const ctx = (user: any) => ({ req: { user } });
  const admin = { id: "a1", role: Role.ADMIN };
  const student = { id: "u1", role: Role.STUDENT };

  beforeEach(async () => {
    jest.clearAllMocks();
    const modRef = await Test.createTestingModule({
      providers: [
        FileStorageResolver,
        { provide: FileStorageService, useValue: service },
      ],
    }).compile();

    resolver = modRef.get(FileStorageResolver);
  });

  it("presignUpload forwards input + ctx.user", async () => {
    service.presignUpload.mockResolvedValueOnce({ url: "signed", key: "k" });
    const res = await resolver.presignUpload(
      {
        tenantId: "t1",
        fileName: "x.png",
        mimeType: "image/png",
        sizeBytes: 100,
      } as any,
      ctx(admin)
    );
    expect(service.presignUpload).toHaveBeenCalledWith(
      expect.objectContaining({ tenantId: "t1" }),
      admin
    );
    expect(res).toEqual({ url: "signed", key: "k" });
  });

  it("completeUpload forwards input + ctx.user", async () => {
    service.completeUpload.mockResolvedValueOnce({ id: "f1", url: "u" });
    const res = await resolver.completeUpload(
      { tenantId: "t1", key: "k1", fileId: "f1" } as any,
      ctx(admin)
    );
    expect(service.completeUpload).toHaveBeenCalledWith(
      expect.objectContaining({ tenantId: "t1" }),
      admin
    );
    expect(res).toEqual({ id: "f1", url: "u" });
  });

  it("getDownloadUrl forwards input + ctx.user", async () => {
    service.getDownloadUrl.mockResolvedValueOnce("https://signed.get/url");
    const res = await resolver.getDownloadUrl(
      { fileId: "f1" } as any,
      ctx(student)
    );
    expect(service.getDownloadUrl).toHaveBeenCalledWith(
      { fileId: "f1" },
      student
    );
    expect(res).toBe("https://signed.get/url");
  });

  it("deleteFile forwards input + ctx.user", async () => {
    service.deleteFile.mockResolvedValueOnce(true);
    const res = await resolver.deleteFile({ fileId: "f1" } as any, ctx(admin));
    expect(service.deleteFile).toHaveBeenCalledWith({ fileId: "f1" }, admin);
    expect(res).toBe(true);
  });

  it("listFiles clamps page/pageSize and forwards input + ctx.user", async () => {
    service.listFiles.mockResolvedValueOnce({
      items: [],
      total: 0,
      page: 1,
      pageSize: 20,
    });
    const res = (await resolver.listFiles(
      { tenantId: "t1", page: -5, pageSize: 1000 } as any,
      ctx(admin)
    )) as any;
    expect(service.listFiles).toHaveBeenCalledWith(
      { tenantId: "t1", page: 1, pageSize: 100 },
      admin
    );
    expect(res.page).toBe(1);
    expect(res.pageSize).toBe(20);
  });
});
