import { IExporter, ExportData } from "@export/exporters/base.exporter";
import { Prisma, PrismaClient } from "@prisma/client";

export class UsersExporter implements IExporter {
  constructor(
    private prisma: PrismaClient,
    private tenantId: string,
    private params: any
  ) {}

  async fetch(): Promise<ExportData> {
    const and: Prisma.UserWhereInput[] = [];
    if (this.params?.role) and.push({ role: this.params.role });
    if (this.params?.gradeId) {
      and.push({
        enrollments: {
          some: {
            tenantId: this.tenantId,
            classroom: { gradeId: this.params.gradeId },
          },
        },
      });
    }
    if (this.params?.classroomId) {
      and.push({
        enrollments: {
          some: {
            tenantId: this.tenantId,
            classroomId: this.params.classroomId,
          },
        },
      });
    }
    const where: Prisma.UserWhereInput = and.length ? { AND: and } : {};

    const users = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        learningHours: true,
        coursesEnrolled: true,
        certificatesEarned: true,
      },
      orderBy: [{ name: "asc" }],
    });

    const headers = [
      "id",
      "name",
      "email",
      "phone",
      "role",
      "learningHours",
      "coursesEnrolled",
      "certificatesEarned",
    ];
    const rows = users.map((u) => ({ ...u }));
    return { headers, rows, filenameBase: `users_${this.tenantId}` };
  }
}
