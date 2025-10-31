import { ExportFormat } from "@prisma/client";

export type ExportRow = Record<string, any>;

export type ExportData = {
  headers: string[];
  rows: ExportRow[];
  filenameBase: string;
};

export interface IExporter {
  fetch(): Promise<ExportData>;
}

export interface FileWriter {
  write(format: ExportFormat, data: ExportData, absPath: string): Promise<void>;
}
