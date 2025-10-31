import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { Injectable, BadRequestException } from "@nestjs/common";
import { RecommendationsExporter } from "@export/exporters/recommendations.exporter";
import { ExportData, IExporter } from "@export/exporters/base.exporter";
import { ExportFormat, Prisma } from "@prisma/client";
import { CreateExportJobInput } from "@export/dto/create-export.input";
import { AssessmentsExporter } from "@export/exporters/assessments.exporter";
import { Parser as Json2Csv } from "json2csv";
import { PreviewExportInput } from "@export/dto/preview-export.input";
import { RunExportJobInput } from "@export/dto/run-export.input";
import { ExportsPageInput } from "@export/dto/exports-page.input";
import { ResultsExporter } from "@export/exporters/results.exporter";
import { promises as fs } from "fs";
import { PrismaService } from "@prisma/prisma.service";
import { UsersExporter } from "@export/exporters/users.exporter";

import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

import * as fse from "fs-extra";
import * as path from "path";

@Injectable()
export class ExportService {
  constructor(private prismaService: PrismaService) {}

  // ===== RBAC =====
  private ensureExportPermission(actor: { id: string; role: string }) {
    const r = (actor.role ?? "").toUpperCase();
    if (!["SUPER_ADMIN", "ADMIN", "COUNSELOR"].includes(r))
      throw new ForbiddenException("Access denied");
  }

  // ===== Exporter factory =====
  private exporter(
    kind: string,
    prisma: PrismaService,
    tenantId: string,
    params: any
  ): IExporter {
    switch (kind) {
      case "USERS":
        return new UsersExporter(prisma, tenantId, params);
      case "ASSESSMENTS":
        return new AssessmentsExporter(prisma, tenantId, params);
      case "RESULTS":
        return new ResultsExporter(prisma, tenantId, params);
      case "RECOMMENDATIONS":
        return new RecommendationsExporter(prisma, tenantId, params);
      default:
        throw new BadRequestException("Unsupported kind");
    }
  }

  // ===== Writers =====
  private async writeCSV(data: ExportData, absPath: string) {
    const parser = new Json2Csv({ fields: data.headers });
    const csv = parser.parse(data.rows);
    await fs.writeFile(absPath, csv, "utf8");
  }

  private async writeXLSX(data: ExportData, absPath: string) {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Export");
    ws.addRow(data.headers);
    for (const r of data.rows) {
      ws.addRow(data.headers.map((h) => r[h]));
    }
    await wb.xlsx.writeFile(absPath);
  }

  private async writePDF(data: ExportData, absPath: string) {
    await new Promise<void>((resolve, reject) => {
      const doc = new PDFDocument({ margin: 36, size: "A4" });
      const stream = fse.createWriteStream(absPath);
      doc.pipe(stream);
      doc.fontSize(14).text("Export Report", { align: "left" });
      doc.moveDown();
      doc.fontSize(9);
      doc.text(data.headers.join(" | "));
      doc.moveDown(0.5);
      doc.moveTo(36, doc.y).lineTo(559, doc.y).stroke();
      doc.moveDown(0.5);
      for (const r of data.rows) {
        const line = data.headers
          .map((h) => {
            const v = r[h];
            if (v === null || v === undefined) return "";
            const s = typeof v === "object" ? JSON.stringify(v) : String(v);
            return s.replace(/\s+/g, " ").slice(0, 120);
          })
          .join(" | ");
        doc.text(line);
      }
      doc.end();
      stream.on("finish", () => resolve());
      stream.on("error", reject);
    });
  }

  private async writeFile(
    format: ExportFormat,
    data: ExportData,
    absPath: string
  ) {
    if (format === "CSV") return this.writeCSV(data, absPath);
    if (format === "XLSX") return this.writeXLSX(data, absPath);
    if (format === "PDF") return this.writePDF(data, absPath);
    throw new BadRequestException("Unsupported format");
  }

  // ===== Public APIs =====
  async createJob(
    input: CreateExportJobInput,
    actor: { id: string; role: string }
  ) {
    this.ensureExportPermission(actor);

    const paramsObj = input.params ? JSON.parse(input.params) : undefined;
    const job = await this.prismaService.exportJob.create({
      data: {
        tenantId: input.tenantId,
        format: input.format,
        status: "PENDING",
        params: paramsObj ?? undefined,
      },
    });

    if (input.queueOnly) return this.mapJob(job);
    return this.runJob({ tenantId: input.tenantId, id: job.id }, actor);
  }

  async runJob(input: RunExportJobInput, actor: { id: string; role: string }) {
    this.ensureExportPermission(actor);

    const job = await this.prismaService.exportJob.findFirst({
      where: { id: input.id, tenantId: input.tenantId },
    });
    if (!job) throw new NotFoundException("Export job not found");
    if (job.status === "PROCESSING")
      throw new BadRequestException("Job is processing");
    if (job.status === "READY") return this.mapJob(job);
    const paramsObj = job.params ?? {};
    const kind =
      (paramsObj as any)?.kind ??
      (paramsObj as any)?.entity ??
      (paramsObj as any)?.type ??
      "USERS";
    await this.prismaService.exportJob.update({
      where: { id: job.id },
      data: { status: "PROCESSING" },
    });

    try {
      const exp = this.exporter(
        kind,
        this.prismaService,
        job.tenantId,
        paramsObj
      );
      const data = await exp.fetch();
      const dir = path.join(process.cwd(), "uploads", "exports", job.tenantId);
      await fse.ensureDir(dir);
      const ext = job.format.toLowerCase();
      const filename = `${data.filenameBase}_${job.id}.${ext}`;
      const absPath = path.join(dir, filename);
      await this.writeFile(job.format, data, absPath);
      const key = path.posix.join("exports", job.tenantId, filename);
      const url = `/uploads/${key}`;
      const file = await this.prismaService.fileAsset.create({
        data: {
          tenantId: job.tenantId,
          key,
          url,
          mimeType:
            job.format === "CSV"
              ? "text/csv"
              : job.format === "XLSX"
                ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                : "application/pdf",
          sizeBytes: (await fse.stat(absPath)).size,
          meta: { kind, headers: data.headers } as any,
        },
      });

      const finished = await this.prismaService.exportJob.update({
        where: { id: job.id },
        data: {
          status: "READY",
          fileId: file.id,
          finishedAt: new Date(),
        },
        include: { file: true },
      });

      return this.mapJob(finished);
    } catch (e: any) {
      const failed = await this.prismaService.exportJob.update({
        where: { id: job.id },
        data: { status: "FAILED", finishedAt: new Date() },
        include: { file: true },
      });
      return this.mapJob(failed);
    }
  }

  async page(input: ExportsPageInput, actor: { id: string; role: string }) {
    this.ensureExportPermission(actor);
    const and: Prisma.ExportJobWhereInput[] = [{ tenantId: input.tenantId }];
    if (input.format) and.push({ format: input.format });
    if (input.status) and.push({ status: input.status });
    if (input.kind)
      and.push({ params: { path: ["kind"], equals: input.kind } as any });
    const where: Prisma.ExportJobWhereInput = { AND: and };
    const page = input.page ?? 1;
    const pageSize = input.pageSize ?? 20;
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.exportJob.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { file: true },
      }),
      this.prismaService.exportJob.count({ where }),
    ]);

    return {
      items: items.map((j) => this.mapJob(j)),
      total,
      page,
      pageSize,
    };
  }

  async preview(
    input: PreviewExportInput,
    actor: { id: string; role: string }
  ) {
    this.ensureExportPermission(actor);
    const paramsObj = input.params ? JSON.parse(input.params) : {};
    const exp = this.exporter(
      input.kind,
      this.prismaService,
      input.tenantId,
      paramsObj
    );
    const data = await exp.fetch();
    const limited = { ...data, rows: data.rows.slice(0, input.limit ?? 10) };
    return {
      headers: limited.headers,
      rows: limited.rows.map((r) => JSON.stringify(r)),
      count: limited.rows.length,
    };
  }

  // ===== helpers =====
  private mapJob(j: any) {
    return {
      id: j.id,
      tenantId: j.tenantId,
      format: j.format,
      status: j.status,
      params: j.params == null ? null : JSON.stringify(j.params),
      fileId: j.fileId ?? null,
      fileKey: j.file?.key ?? null,
      fileUrl: j.file?.url ?? null,
      createdAt: j.createdAt,
      finishedAt: j.finishedAt ?? null,
    };
  }
}
