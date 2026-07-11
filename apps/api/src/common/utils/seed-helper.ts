import { randomBytes } from "crypto";
import { TSeedCtx } from "@common/types/seed.type";
import { PrismaClient } from "@prisma/client";

export const slugify = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .slice(0, 18);

export const randomPassword = (len = 12) =>
  randomBytes(Math.ceil(len / 2))
    .toString("hex")
    .slice(0, len);

export const pick = <T>(arr: T[]) =>
  arr[Math.floor(Math.random() * arr.length)];

const safeDeleteMany = async (
  label: string,
  run: () => Promise<unknown>,
) => {
  try {
    await run();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error);
    if (
      message.includes("does not exist") ||
      message.includes("P2021") ||
      message.includes("P2022")
    ) {
      console.log(`⚠️ ${label} table does not exist, skipping...`);
      return;
    }
    throw error;
  }
};

export const cleanDb = async (ctx: TSeedCtx) => {
  const { prisma } = ctx;
  const p = prisma as PrismaClient;

  // Child tables first so Restrict FKs (e.g. SchoolAssignment.createdBy) don't block User/School deletes.
  await safeDeleteMany("CounselorMessage", () =>
    p.counselorMessage.deleteMany(),
  );
  await safeDeleteMany("CounselorMessageThread", () =>
    p.counselorMessageThread.deleteMany(),
  );
  await safeDeleteMany("CounselorNote", () => p.counselorNote.deleteMany());
  await safeDeleteMany("CounselorReview", () =>
    p.counselorReview.deleteMany(),
  );
  await safeDeleteMany("CounselorStudentLink", () =>
    p.counselorStudentLink.deleteMany(),
  );
  await safeDeleteMany("StudentAnswer", () => p.studentAnswer.deleteMany());
  await safeDeleteMany("AssessmentResult", () =>
    p.assessmentResult.deleteMany(),
  );
  await safeDeleteMany("StudentAssignment", () =>
    p.studentAssignment.deleteMany(),
  );
  await safeDeleteMany("AssignmentQuestion", () =>
    p.assignmentQuestion.deleteMany(),
  );
  await safeDeleteMany("SchoolAssignment", () =>
    p.schoolAssignment.deleteMany(),
  );
  await safeDeleteMany("Enrollment", () => p.enrollment.deleteMany());
  await safeDeleteMany("ParentStudentLink", () =>
    p.parentStudentLink.deleteMany(),
  );
  await safeDeleteMany("StudentGradeRecord", () =>
    p.studentGradeRecord.deleteMany(),
  );
  await safeDeleteMany("StudentActivity", () =>
    p.studentActivity.deleteMany(),
  );
  await safeDeleteMany("ParentResource", () => p.parentResource.deleteMany());
  await safeDeleteMany("CounselingSession", () =>
    p.counselingSession.deleteMany(),
  );
  await safeDeleteMany("InAppNotification", () =>
    p.inAppNotification.deleteMany(),
  );
  await safeDeleteMany("AuditLog", () => p.auditLog.deleteMany());
  await safeDeleteMany("AuthSession", () => p.authSession.deleteMany());
  await safeDeleteMany("OtpCode", () => p.otpCode.deleteMany());
  await safeDeleteMany("AccessRequest", () => p.accessRequest.deleteMany());
  await safeDeleteMany("Classroom", () => p.classroom.deleteMany());
  await safeDeleteMany("Grade", () => p.grade.deleteMany());
  await safeDeleteMany("User", () => p.user.deleteMany());
  await safeDeleteMany("School", () => p.school.deleteMany());
};

export const envInt = (key: string, def: number) => {
  const v = process.env[key];
  const n = v ? parseInt(v, 10) : def;
  return Number.isFinite(n) ? n : def;
};
