import { TGradeSeedItem, TQuestionWithIntelligences } from "@ctypes/seed.type";
import { Role, StudentAssignmentStatus, UserStatus } from "@prisma/client";
import { TAdminSeedMap, TSchoolSeedItem, TSeedCtx } from "@ctypes/seed.type";
import { AssignmentStatus, AssignmentTargetMode } from "@prisma/client";
import { AuditAction, IntelligenceKey } from "@prisma/client";
import { TAssignmentQuestionCreated } from "@ctypes/seed.type";
import { TClassroomSeedItem } from "@ctypes/seed.type";

const getBand = (value: number) => {
  if (value >= 80) return "VERY_STRONG";
  if (value >= 60) return "STRONG";
  if (value >= 40) return "MODERATE";
  return "NEEDS_SUPPORT";
};

const emptyScoreMap = (): Record<IntelligenceKey, number> => ({
  LINGUISTIC: 0,
  LOGICAL_MATHEMATICAL: 0,
  MUSICAL: 0,
  BODILY_KINESTHETIC: 0,
  VISUAL_SPATIAL: 0,
  NATURALISTIC: 0,
  INTERPERSONAL: 0,
  INTRAPERSONAL: 0,
});

export const seedAssignments = async (
  ctx: TSeedCtx,
  schools: TSchoolSeedItem[],
  adminMap: TAdminSeedMap,
  gradesBySchool?: Record<string, TGradeSeedItem[]>,
  classroomsBySchool?: Record<string, TClassroomSeedItem[]>,
) => {
  const { prisma, faker, cfg } = ctx;
  const assessmentQuestions = await prisma.assessmentQuestion.findMany({
    where: { isActive: true },
    include: {
      intelligences: true,
    },
    orderBy: { order: "asc" },
  });
  const typedAssessmentQuestions =
    assessmentQuestions as TQuestionWithIntelligences[];
  if (!typedAssessmentQuestions.length) return;
  const assessmentQuestionMap = new Map(
    typedAssessmentQuestions.map((question) => [question.id, question]),
  );
  const questionCountMap = emptyScoreMap();
  for (const question of typedAssessmentQuestions) {
    for (const relation of question.intelligences) {
      questionCountMap[relation.intelligenceKey] += 1;
    }
  }
  for (const school of schools) {
    const adminId = adminMap[school.id]?.id;
    if (!adminId) continue;
    const students = await prisma.user.findMany({
      where: {
        schoolId: school.id,
        role: Role.STUDENT,
        status: UserStatus.ACTIVE,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
      },
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
      if (schoolClassrooms.length > 0 && modeRoll <= 20) {
        targetMode = AssignmentTargetMode.BY_CLASSROOM;
        targetClassroomId = faker.helpers.arrayElement(schoolClassrooms).id;
      } else if (schoolGrades.length > 0 && modeRoll <= 40) {
        targetMode = AssignmentTargetMode.BY_GRADE;
        targetGradeId = faker.helpers.arrayElement(schoolGrades).id;
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

      const assignmentQuestionsCreated = await Promise.all(
        typedAssessmentQuestions.map((question, index) =>
          prisma.assignmentQuestion.create({
            data: {
              assignmentId: assignment.id,
              order: index + 1,
              questionNumber: question.code,
              text: question.text,
              isActive: question.isActive,
              sourceQuestionId: question.id,
            },
            select: {
              id: true,
              questionNumber: true,
              sourceQuestionId: true,
            },
          }),
        ),
      );

      const typedAssignmentQuestions =
        assignmentQuestionsCreated as TAssignmentQuestionCreated[];
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
            studentId: { in: students.map((student) => student.id) },
            classroom: {
              schoolId: school.id,
              gradeId: targetGradeId,
              deletedAt: null,
            },
          },
          select: { studentId: true },
          distinct: ["studentId"],
        });

        const ids = new Set(enrollments.map((item) => item.studentId));
        eligibleStudents = students.filter((student) => ids.has(student.id));
      }

      if (
        targetMode === AssignmentTargetMode.BY_CLASSROOM &&
        targetClassroomId
      ) {
        const enrollments = await prisma.enrollment.findMany({
          where: {
            endedAt: null,
            studentId: { in: students.map((student) => student.id) },
            classroomId: targetClassroomId,
            classroom: {
              schoolId: school.id,
              deletedAt: null,
            },
          },
          select: { studentId: true },
          distinct: ["studentId"],
        });
        const ids = new Set(enrollments.map((item) => item.studentId));
        eligibleStudents = students.filter((student) => ids.has(student.id));
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
                  min: Math.max(
                    5,
                    Math.floor(typedAssignmentQuestions.length * 0.2),
                  ),
                  max: Math.max(
                    10,
                    Math.floor(typedAssignmentQuestions.length * 0.7),
                  ),
                })
              : typedAssignmentQuestions.length;

          const answerSet =
            status === StudentAssignmentStatus.IN_PROGRESS
              ? faker.helpers.arrayElements(
                  typedAssignmentQuestions,
                  answerLimit,
                )
              : typedAssignmentQuestions;

          await prisma.studentAnswer.createMany({
            data: answerSet.map((question) => ({
              studentAssignmentId: studentAssignment.id,
              assignmentQuestionId: question.id,
              assessmentQuestionId: question.sourceQuestionId ?? null,
              value: faker.number.int({ min: 1, max: 5 }),
            })),
          });
        }

        if (status === StudentAssignmentStatus.EVALUATED) {
          const answers = await prisma.studentAnswer.findMany({
            where: {
              studentAssignmentId: studentAssignment.id,
            },
            include: {
              assignmentQuestion: {
                select: {
                  id: true,
                  sourceQuestionId: true,
                },
              },
            },
          });
          const scoreMap = emptyScoreMap();
          for (const answer of answers) {
            const sourceQuestionId =
              answer.assessmentQuestionId ??
              answer.assignmentQuestion.sourceQuestionId;
            if (!sourceQuestionId) continue;
            const linkedQuestion = assessmentQuestionMap.get(sourceQuestionId);
            if (!linkedQuestion) continue;
            for (const relation of linkedQuestion.intelligences) {
              scoreMap[relation.intelligenceKey] += answer.value;
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
            logicalMath: percentage(IntelligenceKey.LOGICAL_MATHEMATICAL),
            musical: percentage(IntelligenceKey.MUSICAL),
            bodilyKinesthetic: percentage(IntelligenceKey.BODILY_KINESTHETIC),
            visualSpatial: percentage(IntelligenceKey.VISUAL_SPATIAL),
            naturalistic: percentage(IntelligenceKey.NATURALISTIC),
            interpersonal: percentage(IntelligenceKey.INTERPERSONAL),
            intrapersonal: percentage(IntelligenceKey.INTRAPERSONAL),
          };

          const dominantMap: Record<IntelligenceKey, number> = {
            LINGUISTIC: payload.linguistic,
            LOGICAL_MATHEMATICAL: payload.logicalMath,
            MUSICAL: payload.musical,
            BODILY_KINESTHETIC: payload.bodilyKinesthetic,
            VISUAL_SPATIAL: payload.visualSpatial,
            NATURALISTIC: payload.naturalistic,
            INTERPERSONAL: payload.interpersonal,
            INTRAPERSONAL: payload.intrapersonal,
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
