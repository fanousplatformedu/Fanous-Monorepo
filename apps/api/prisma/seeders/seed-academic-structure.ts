import { AuditAction } from "@prisma/client";
import { TSeedCtx } from "@ctypes/seed.type";

export const seedGradesAndClassrooms = async (
  ctx: TSeedCtx,
  schools: Array<{ id: string; name: string; code: string | null }>,
  adminMap: Record<string, { id: string }>,
) => {
  const { prisma, cfg } = ctx;

  const gradesBySchool: Record<
    string,
    Array<{ id: string; name: string }>
  > = {};
  const classroomsBySchool: Record<
    string,
    Array<{ id: string; name: string; gradeId: string }>
  > = {};

  const academicYear = Number(process.env.SEED_ACADEMIC_YEAR ?? "2026") || 2026;

  for (const school of schools) {
    gradesBySchool[school.id] = [];
    classroomsBySchool[school.id] = [];

    for (let i = 1; i <= cfg.gradesPerSchool; i++) {
      const gradeName = `Grade ${i}`;
      const gradeCode = `G-${i}`;

      const existingGrade = await prisma.grade.findFirst({
        where: {
          schoolId: school.id,
          name: gradeName,
        },
        select: { id: true, name: true },
      });

      const grade =
        existingGrade ??
        (await prisma.grade.create({
          data: {
            schoolId: school.id,
            name: gradeName,
            code: gradeCode,
          },
          select: { id: true, name: true },
        }));

      gradesBySchool[school.id].push(grade);

      if (!existingGrade) {
        await prisma.auditLog.create({
          data: {
            action: AuditAction.GRADE_CREATE,
            actorId: adminMap[school.id]?.id ?? null,
            schoolId: school.id,
            entityType: "Grade",
            entityId: grade.id,
            metadata: {
              name: grade.name,
              code: gradeCode,
            },
          },
        });
      }

      for (let j = 1; j <= cfg.classroomsPerGrade; j++) {
        const classroomName = `Class ${i}-${j}`;
        const classroomCode = `C-${i}-${j}`;

        const existingClassroom = await prisma.classroom.findFirst({
          where: {
            schoolId: school.id,
            gradeId: grade.id,
            name: classroomName,
          },
          select: { id: true, name: true, gradeId: true },
        });

        const classroom =
          existingClassroom ??
          (await prisma.classroom.create({
            data: {
              schoolId: school.id,
              gradeId: grade.id,
              name: classroomName,
              code: classroomCode,
              year: academicYear,
            },
            select: { id: true, name: true, gradeId: true },
          }));

        classroomsBySchool[school.id].push(classroom);

        if (!existingClassroom) {
          await prisma.auditLog.create({
            data: {
              action: AuditAction.CLASSROOM_CREATE,
              actorId: adminMap[school.id]?.id ?? null,
              schoolId: school.id,
              entityType: "Classroom",
              entityId: classroom.id,
              metadata: {
                name: classroom.name,
                code: classroomCode,
                year: academicYear,
              },
            },
          });
        }
      }
    }
  }

  return { gradesBySchool, classroomsBySchool };
};
