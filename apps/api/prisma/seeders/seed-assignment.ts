import { Role, StudentAssignmentStatus, UserStatus } from "@prisma/client";
import { AssignmentStatus, AssignmentTargetMode } from "@prisma/client";
import { AuditAction, IntelligenceKey } from "@prisma/client";
import { TSeedCtx } from "@ctypes/seed.type";

const getBand = (value: number) => {
  if (value >= 80) return "VERY_STRONG";
  if (value >= 60) return "STRONG";
  if (value >= 40) return "MODERATE";
  return "NEEDS_SUPPORT";
};

export const seedAssignments = async (
  ctx: TSeedCtx,
  schools: Array<{ id: string; name: string; code: string | null }>,
  adminMap: Record<string, { id: string }>,
  gradesBySchool?: Record<string, Array<{ id: string; name: string }>>,
  classroomsBySchool?: Record<
    string,
    Array<{ id: string; name: string; gradeId: string }>
  >,
) => {
  const { prisma, faker, cfg } = ctx;

  const questions = await prisma.assessmentQuestion.findMany({
    where: { isActive: true },
    include: {
      intelligences: true,
    },
    orderBy: { order: "asc" },
  });

  for (const school of schools) {
    const adminId = adminMap[school.id]?.id;
    if (!adminId) continue;

    const students = await prisma.user.findMany({
      where: {
        schoolId: school.id,
        role: Role.STUDENT,
        status: UserStatus.ACTIVE,
      },
      select: { id: true, fullName: true, email: true },
    });

    if (!students.length) continue;

    const schoolGrades = gradesBySchool?.[school.id] ?? [];
    const schoolClassrooms = classroomsBySchool?.[school.id] ?? [];

    for (let i = 0; i < cfg.assignmentsPerSchool; i++) {
      const publishedAt = faker.date.recent({ days: 20 });
      const dueAt = faker.date.soon({ days: 20, refDate: publishedAt });

      let targetMode: AssignmentTargetMode = AssignmentTargetMode.ALL_STUDENTS;
      let targetGradeId: string | null = null;
      let targetClassroomId: string | null = null;

      const modeRoll = faker.number.int({ min: 1, max: 100 });

      if (schoolClassrooms.length && modeRoll <= 20) {
        targetMode = AssignmentTargetMode.BY_CLASSROOM;
        targetClassroomId =
          faker.helpers.arrayElement(schoolClassrooms).id ?? null;
      } else if (schoolGrades.length && modeRoll <= 40) {
        targetMode = AssignmentTargetMode.BY_GRADE;
        targetGradeId = faker.helpers.arrayElement(schoolGrades).id ?? null;
      } else {
        targetMode = AssignmentTargetMode.ALL_STUDENTS;
      }

      const assignment = await prisma.schoolAssignment.create({
        data: {
          schoolId: school.id,
          title: `Multiple Intelligence Assessment ${i + 1}`,
          description: faker.lorem.sentences(2),
          status: AssignmentStatus.PUBLISHED,
          targetMode,
          targetGradeId,
          targetClassroomId,
          dueAt,
          publishedAt,
          createdById: adminId,
        },
      });

      await prisma.auditLog.create({
        data: {
          action: AuditAction.ASSIGNMENT_CREATE,
          actorId: adminId,
          schoolId: school.id,
          entityType: "SchoolAssignment",
          entityId: assignment.id,
          metadata: {
            title: assignment.title,
            targetMode: assignment.targetMode,
            targetGradeId: assignment.targetGradeId,
            targetClassroomId: assignment.targetClassroomId,
          },
        },
      });

      await prisma.auditLog.create({
        data: {
          action: AuditAction.ASSIGNMENT_PUBLISH,
          actorId: adminId,
          schoolId: school.id,
          entityType: "SchoolAssignment",
          entityId: assignment.id,
          metadata: {
            status: assignment.status,
            publishedAt: assignment.publishedAt,
          },
        },
      });

      let eligibleStudents = students;

      if (targetMode === AssignmentTargetMode.BY_GRADE && targetGradeId) {
        const enrollments = await prisma.enrollment.findMany({
          where: {
            endedAt: null,
            studentId: { in: students.map((s) => s.id) },
            classroom: {
              schoolId: school.id,
              gradeId: targetGradeId,
              deletedAt: null,
            },
          },
          select: { studentId: true },
          distinct: ["studentId"],
        });

        const ids = new Set(enrollments.map((e) => e.studentId));
        eligibleStudents = students.filter((s) => ids.has(s.id));
      }

      if (
        targetMode === AssignmentTargetMode.BY_CLASSROOM &&
        targetClassroomId
      ) {
        const enrollments = await prisma.enrollment.findMany({
          where: {
            endedAt: null,
            studentId: { in: students.map((s) => s.id) },
            classroomId: targetClassroomId,
            classroom: {
              schoolId: school.id,
              deletedAt: null,
            },
          },
          select: { studentId: true },
          distinct: ["studentId"],
        });

        const ids = new Set(enrollments.map((e) => e.studentId));
        eligibleStudents = students.filter((s) => ids.has(s.id));
      }

      for (const student of eligibleStudents) {
        const participate =
          faker.number.int({ min: 1, max: 100 }) <=
          cfg.assignmentParticipationRate;

        if (!participate) continue;

        const statusRoll = faker.number.int({ min: 1, max: 100 });

        let status: StudentAssignmentStatus = StudentAssignmentStatus.PENDING;
        let startedAt: Date | null = null;
        let submittedAt: Date | null = null;
        let evaluatedAt: Date | null = null;
        let completionRate = 0;

        if (statusRoll <= 25) {
          status = StudentAssignmentStatus.PENDING;
        } else if (statusRoll <= 45) {
          status = StudentAssignmentStatus.IN_PROGRESS;
          startedAt = faker.date.between({
            from: publishedAt,
            to: dueAt,
          });
          completionRate = faker.number.float({
            min: 5,
            max: 75,
            fractionDigits: 2,
          });
        } else if (statusRoll <= 70) {
          status = StudentAssignmentStatus.SUBMITTED;
          startedAt = faker.date.between({
            from: publishedAt,
            to: dueAt,
          });
          submittedAt = faker.date.between({
            from: startedAt,
            to: dueAt,
          });
          completionRate = 100;
        } else {
          status = StudentAssignmentStatus.EVALUATED;
          startedAt = faker.date.between({
            from: publishedAt,
            to: dueAt,
          });
          submittedAt = faker.date.between({
            from: startedAt,
            to: dueAt,
          });
          evaluatedAt = faker.date.between({
            from: submittedAt,
            to: dueAt,
          });
          completionRate = 100;
        }

        const studentAssignment = await prisma.studentAssignment.create({
          data: {
            assignmentId: assignment.id,
            studentId: student.id,
            status,
            startedAt,
            submittedAt,
            evaluatedAt,
            completionRate,
          },
        });

        if (
          status === StudentAssignmentStatus.IN_PROGRESS ||
          status === StudentAssignmentStatus.SUBMITTED ||
          status === StudentAssignmentStatus.EVALUATED
        ) {
          const answerLimit =
            status === StudentAssignmentStatus.IN_PROGRESS
              ? faker.number.int({
                  min: Math.max(5, Math.floor(questions.length * 0.2)),
                  max: Math.max(10, Math.floor(questions.length * 0.7)),
                })
              : questions.length;

          const answerSet =
            status === StudentAssignmentStatus.IN_PROGRESS
              ? faker.helpers.arrayElements(questions, answerLimit)
              : questions;

          await prisma.studentAnswer.createMany({
            data: answerSet.map((question) => ({
              studentAssignmentId: studentAssignment.id,
              questionId: question.id,
              value: faker.number.int({ min: 1, max: 5 }),
            })),
          });
        }

        if (status === StudentAssignmentStatus.EVALUATED) {
          const answers = await prisma.studentAnswer.findMany({
            where: { studentAssignmentId: studentAssignment.id },
            include: {
              question: {
                include: {
                  intelligences: true,
                },
              },
            },
          });

          const scoreMap: Record<IntelligenceKey, number> = {
            LINGUISTIC: 0,
            LOGICAL_MATH: 0,
            MUSICAL: 0,
            BODILY_KINESTHETIC: 0,
            VISUAL_SPATIAL: 0,
            NATURALISTIC: 0,
            INTERPERSONAL: 0,
            INTRAPERSONAL: 0,
          };

          const questionCountMap: Record<IntelligenceKey, number> = {
            LINGUISTIC: 0,
            LOGICAL_MATH: 0,
            MUSICAL: 0,
            BODILY_KINESTHETIC: 0,
            VISUAL_SPATIAL: 0,
            NATURALISTIC: 0,
            INTERPERSONAL: 0,
            INTRAPERSONAL: 0,
          };

          for (const question of questions) {
            for (const rel of question.intelligences) {
              questionCountMap[rel.intelligenceKey] += 1;
            }
          }

          for (const answer of answers) {
            for (const rel of answer.question.intelligences) {
              scoreMap[rel.intelligenceKey] += answer.value;
            }
          }

          const percentage = (key: IntelligenceKey) => {
            const maxScore = questionCountMap[key] * 5;
            return maxScore > 0
              ? Number(((scoreMap[key] / maxScore) * 100).toFixed(2))
              : 0;
          };

          const payload = {
            linguistic: percentage(IntelligenceKey.LINGUISTIC),
            logicalMath: percentage(IntelligenceKey.LOGICAL_MATH),
            musical: percentage(IntelligenceKey.MUSICAL),
            bodilyKinesthetic: percentage(IntelligenceKey.BODILY_KINESTHETIC),
            visualSpatial: percentage(IntelligenceKey.VISUAL_SPATIAL),
            naturalistic: percentage(IntelligenceKey.NATURALISTIC),
            interpersonal: percentage(IntelligenceKey.INTERPERSONAL),
            intrapersonal: percentage(IntelligenceKey.INTRAPERSONAL),
          };

          const dominantMap: Record<IntelligenceKey, number> = {
            [IntelligenceKey.LINGUISTIC]: payload.linguistic,
            [IntelligenceKey.LOGICAL_MATH]: payload.logicalMath,
            [IntelligenceKey.MUSICAL]: payload.musical,
            [IntelligenceKey.BODILY_KINESTHETIC]: payload.bodilyKinesthetic,
            [IntelligenceKey.VISUAL_SPATIAL]: payload.visualSpatial,
            [IntelligenceKey.NATURALISTIC]: payload.naturalistic,
            [IntelligenceKey.INTERPERSONAL]: payload.interpersonal,
            [IntelligenceKey.INTRAPERSONAL]: payload.intrapersonal,
          };

          const dominantKey = Object.entries(dominantMap).sort(
            (a, b) => b[1] - a[1],
          )[0]?.[0] as IntelligenceKey;

          await prisma.assessmentResult.create({
            data: {
              studentAssignmentId: studentAssignment.id,
              schoolId: school.id,
              studentId: student.id,
              ...payload,
              dominantKey,
              summaryJson: {
                bands: {
                  linguistic: getBand(payload.linguistic),
                  logicalMath: getBand(payload.logicalMath),
                  musical: getBand(payload.musical),
                  bodilyKinesthetic: getBand(payload.bodilyKinesthetic),
                  visualSpatial: getBand(payload.visualSpatial),
                  naturalistic: getBand(payload.naturalistic),
                  interpersonal: getBand(payload.interpersonal),
                  intrapersonal: getBand(payload.intrapersonal),
                },
              },
            },
          });

          await prisma.auditLog.create({
            data: {
              action: AuditAction.ASSESSMENT_EVALUATE,
              actorId: null,
              schoolId: school.id,
              entityType: "StudentAssignment",
              entityId: studentAssignment.id,
              metadata: {
                dominantKey,
                studentId: student.id,
              },
            },
          });
        }
      }
    }
  }
};
