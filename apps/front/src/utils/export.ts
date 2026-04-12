import { TExportColumn } from "@/types/constant";

import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";

export const exportToCsv = <T>(
  filename: string,
  rows: T[],
  columns: TExportColumn<T>[],
) => {
  const csvRows = [
    columns.map((col) => col.header).join(","),
    ...rows.map((row) =>
      columns
        .map((col) => {
          const raw = col.accessor(row);
          const value = raw == null ? "" : String(raw);
          return `"${value.replace(/"/g, '""')}"`;
        })
        .join(","),
    ),
  ];

  const blob = new Blob([csvRows.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToPdf = <T>(
  title: string,
  filename: string,
  rows: T[],
  columns: TExportColumn<T>[],
) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });

  doc.setFontSize(16);
  doc.text(title, 40, 40);

  autoTable(doc, {
    startY: 60,
    head: [columns.map((col) => col.header)],
    body: rows.map((row) =>
      columns.map((col) => {
        const raw = col.accessor(row);
        return raw == null ? "" : String(raw);
      }),
    ),
    styles: {
      fontSize: 9,
      cellPadding: 6,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
    },
    bodyStyles: {
      textColor: 40,
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    margin: { left: 30, right: 30 },
  });
  doc.save(`${filename}.pdf`);
};
