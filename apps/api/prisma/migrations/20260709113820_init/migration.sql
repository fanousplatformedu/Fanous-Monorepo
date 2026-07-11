-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PARENT', 'STUDENT', 'COUNSELOR', 'SUPER_ADMIN', 'SCHOOL_ADMIN');

-- CreateEnum
CREATE TYPE "SchoolStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DELETED', 'DISABLED');

-- CreateEnum
CREATE TYPE "AccessRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELED');

-- CreateEnum
CREATE TYPE "AccessRequestRole" AS ENUM ('PARENT', 'STUDENT', 'COUNSELOR');

-- CreateEnum
CREATE TYPE "OtpChannel" AS ENUM ('SMS', 'EMAIL');

-- CreateEnum
CREATE TYPE "OtpPurpose" AS ENUM ('LOGIN');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('SCHOOL_CREATE', 'SCHOOL_UPDATE', 'SCHOOL_SUSPEND', 'SCHOOL_ARCHIVE', 'SCHOOL_UNSUSPEND', 'USER_DELETE', 'ADMIN_CREATE', 'ADMIN_DELETE', 'USER_DISABLE', 'ADMIN_DISABLE', 'ACCESS_REQUEST_SUBMIT', 'ACCESS_REQUEST_REJECT', 'ACCESS_REQUEST_APPROVE', 'AUTH_LOGOUT', 'OTP_REQUEST', 'AUTH_REFRESH', 'OTP_VERIFY_FAIL', 'AUTH_LOGIN_FAIL', 'AUTH_LOGIN_SUCCESS', 'OTP_VERIFY_SUCCESS', 'ADMIN_PASSWORD_CHANGED', 'ADMIN_PASSWORD_RESET', 'GRADE_CREATE', 'GRADE_UPDATE', 'GRADE_ARCHIVE', 'GRADE_RESTORE', 'MEMBER_CREATED', 'CLASSROOM_CREATE', 'ENROLLMENT_CLOSE', 'CLASSROOM_UPDATE', 'CLASSROOM_ARCHIVE', 'CLASSROOM_RESTORE', 'ENROLLMENT_CREATE', 'ASSIGNMENT_CLOSE', 'ASSIGNMENT_CREATE', 'ASSIGNMENT_UPDATE', 'ASSIGNMENT_ASSIGN', 'ASSESSMENT_SUBMIT', 'ASSESSMENT_EXPORT', 'ASSIGNMENT_PUBLISH', 'ASSESSMENT_EVALUATE', 'INAPP_NOTIFICATION_READ', 'INAPP_NOTIFICATION_CREATE', 'COUNSELOR_ASSIGNMENT_CREATE', 'COUNSELOR_ASSIGNMENT_ARCHIVE', 'COUNSELOR_ASSIGNMENT_RESTORE');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('DRAFT', 'CLOSED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "AssignmentTargetMode" AS ENUM ('BY_GRADE', 'ALL_STUDENTS', 'BY_CLASSROOM', 'BY_STUDENT_IDS');

-- CreateEnum
CREATE TYPE "StudentAssignmentStatus" AS ENUM ('PENDING', 'SUBMITTED', 'EVALUATED', 'IN_PROGRESS', 'NOT_STARTED');

-- CreateEnum
CREATE TYPE "IntelligenceKey" AS ENUM ('MUSICAL', 'LINGUISTIC', 'NATURALISTIC', 'INTERPERSONAL', 'INTRAPERSONAL', 'VISUAL_SPATIAL', 'BODILY_KINESTHETIC', 'LOGICAL_MATHEMATICAL');

-- CreateEnum
CREATE TYPE "InAppNotificationType" AS ENUM ('GENERAL', 'RESULT_READY', 'ASSIGNMENT_DUE', 'ASSIGNMENT_PUBLISHED');

-- CreateEnum
CREATE TYPE "CounselingSessionStatus" AS ENUM ('CANCELED', 'REQUESTED', 'CONFIRMED', 'COMPLETED', 'RESCHEDULED');

-- CreateEnum
CREATE TYPE "ParentRelationType" AS ENUM ('OTHER', 'MOTHER', 'FATHER', 'GUARDIAN');

-- CreateEnum
CREATE TYPE "StudentActivityType" AS ENUM ('SESSION_BOOKED', 'PROFILE_UPDATED', 'RESULT_PUBLISHED', 'SESSION_REQUESTED', 'SESSION_COMPLETED', 'ASSIGNMENT_STARTED', 'ASSIGNMENT_ASSIGNED', 'ASSIGNMENT_SUBMITTED', 'ASSESSMENT_COMPLETED', 'CAREER_MATCH_UPDATED');

-- CreateEnum
CREATE TYPE "ParentResourceCategory" AS ENUM ('WELLBEING', 'CAREER_GUIDE', 'SUPPORT_TEEN', 'STUDY_SUPPORT', 'COMMUNICATION');

-- CreateEnum
CREATE TYPE "CounselorStudentLinkStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CounselorReviewStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'REVIEWED', 'RETURNED');

-- CreateEnum
CREATE TYPE "CounselorMessageSenderRole" AS ENUM ('COUNSELOR', 'STUDENT', 'PARENT', 'SCHOOL_ADMIN');

-- CreateEnum
CREATE TYPE "CounselorMessageThreadStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "CounselorExportFormat" AS ENUM ('PDF', 'EXCEL');

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "status" "SchoolStatus" NOT NULL DEFAULT 'ACTIVE',
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "schoolId" TEXT,
    "role" "Role" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "username" TEXT,
    "passwordHash" TEXT,
    "email" TEXT,
    "mobile" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "avatarUrl" TEXT,
    "forcePasswordChange" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessRequest" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "status" "AccessRequestStatus" NOT NULL DEFAULT 'PENDING',
    "requestedRole" "AccessRequestRole" NOT NULL,
    "email" TEXT,
    "mobile" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "approvedUserId" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "rejectReason" TEXT,
    "submittedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtpCode" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "userId" TEXT,
    "channel" "OtpChannel" NOT NULL,
    "purpose" "OtpPurpose" NOT NULL DEFAULT 'LOGIN',
    "destination" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 5,
    "resendAfter" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OtpCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthSession" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "schoolId" TEXT,
    "userId" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "refreshTokenHash" TEXT NOT NULL,
    "parentSid" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "AuthSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "actorId" TEXT,
    "schoolId" TEXT,
    "entityType" TEXT,
    "entityId" TEXT,
    "metadata" JSONB,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grade" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classroom" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "gradeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "year" INTEGER,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "classroomId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentQuestion" (
    "id" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssessmentQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentQuestionIntelligence" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "intelligenceKey" "IntelligenceKey" NOT NULL,

    CONSTRAINT "AssessmentQuestionIntelligence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentQuestion" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "sourceQuestionId" TEXT,
    "order" INTEGER NOT NULL,
    "questionNumber" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssignmentQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolAssignment" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'DRAFT',
    "targetMode" "AssignmentTargetMode" NOT NULL DEFAULT 'ALL_STUDENTS',
    "targetGradeId" TEXT,
    "targetClassroomId" TEXT,
    "dueAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "SchoolAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAssignment" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" "StudentAssignmentStatus" NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "evaluatedAt" TIMESTAMP(3),
    "completionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAnswer" (
    "id" TEXT NOT NULL,
    "studentAssignmentId" TEXT NOT NULL,
    "assignmentQuestionId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assessmentQuestionId" TEXT,

    CONSTRAINT "StudentAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentResult" (
    "id" TEXT NOT NULL,
    "studentAssignmentId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "linguistic" DOUBLE PRECISION NOT NULL,
    "logicalMath" DOUBLE PRECISION NOT NULL,
    "musical" DOUBLE PRECISION NOT NULL,
    "bodilyKinesthetic" DOUBLE PRECISION NOT NULL,
    "visualSpatial" DOUBLE PRECISION NOT NULL,
    "naturalistic" DOUBLE PRECISION NOT NULL,
    "interpersonal" DOUBLE PRECISION NOT NULL,
    "intrapersonal" DOUBLE PRECISION NOT NULL,
    "dominantKey" "IntelligenceKey",
    "summaryJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssessmentResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InAppNotification" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT,
    "userId" TEXT NOT NULL,
    "type" "InAppNotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "actionUrl" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "InAppNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CounselingSession" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "counselorId" TEXT,
    "requestedById" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "note" TEXT,
    "meetingUrl" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "status" "CounselingSessionStatus" NOT NULL DEFAULT 'REQUESTED',
    "canceledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "CounselingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentStudentLink" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "relation" "ParentRelationType" NOT NULL DEFAULT 'OTHER',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "ParentStudentLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentGradeRecord" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "maxScore" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "examTitle" TEXT,
    "termLabel" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "StudentGradeRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentActivity" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "type" "StudentActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "StudentActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentResource" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT,
    "category" "ParentResourceCategory" NOT NULL,
    "coverImageUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CounselorStudentLink" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "counselorId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" "CounselorStudentLinkStatus" NOT NULL DEFAULT 'ACTIVE',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CounselorStudentLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CounselorReview" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "counselorId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "resultId" TEXT,
    "status" "CounselorReviewStatus" NOT NULL DEFAULT 'PENDING',
    "feedback" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CounselorReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CounselorNote" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "counselorId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CounselorNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CounselorMessageThread" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "counselorId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" "CounselorMessageThreadStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CounselorMessageThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CounselorMessage" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "senderRole" "CounselorMessageSenderRole" NOT NULL,
    "body" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CounselorMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "School_code_key" ON "School"("code");

-- CreateIndex
CREATE INDEX "School_status_idx" ON "School"("status");

-- CreateIndex
CREATE INDEX "School_createdAt_idx" ON "School"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_key" ON "User"("mobile");

-- CreateIndex
CREATE INDEX "User_schoolId_idx" ON "User"("schoolId");

-- CreateIndex
CREATE INDEX "User_role_status_idx" ON "User"("role", "status");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_mobile_idx" ON "User"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "User_schoolId_email_key" ON "User"("schoolId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "User_schoolId_mobile_key" ON "User"("schoolId", "mobile");

-- CreateIndex
CREATE INDEX "AccessRequest_schoolId_status_idx" ON "AccessRequest"("schoolId", "status");

-- CreateIndex
CREATE INDEX "AccessRequest_schoolId_requestedRole_idx" ON "AccessRequest"("schoolId", "requestedRole");

-- CreateIndex
CREATE INDEX "AccessRequest_createdAt_idx" ON "AccessRequest"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AccessRequest_schoolId_email_status_key" ON "AccessRequest"("schoolId", "email", "status");

-- CreateIndex
CREATE UNIQUE INDEX "AccessRequest_schoolId_mobile_status_key" ON "AccessRequest"("schoolId", "mobile", "status");

-- CreateIndex
CREATE INDEX "OtpCode_schoolId_destination_idx" ON "OtpCode"("schoolId", "destination");

-- CreateIndex
CREATE INDEX "OtpCode_userId_idx" ON "OtpCode"("userId");

-- CreateIndex
CREATE INDEX "OtpCode_expiresAt_idx" ON "OtpCode"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "AuthSession_sid_key" ON "AuthSession"("sid");

-- CreateIndex
CREATE INDEX "AuthSession_userId_status_idx" ON "AuthSession"("userId", "status");

-- CreateIndex
CREATE INDEX "AuthSession_schoolId_idx" ON "AuthSession"("schoolId");

-- CreateIndex
CREATE INDEX "AuthSession_expiresAt_idx" ON "AuthSession"("expiresAt");

-- CreateIndex
CREATE INDEX "AuditLog_schoolId_createdAt_idx" ON "AuditLog"("schoolId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_createdAt_idx" ON "AuditLog"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_action_createdAt_idx" ON "AuditLog"("action", "createdAt");

-- CreateIndex
CREATE INDEX "Grade_schoolId_deletedAt_idx" ON "Grade"("schoolId", "deletedAt");

-- CreateIndex
CREATE INDEX "Grade_createdAt_idx" ON "Grade"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Grade_schoolId_name_key" ON "Grade"("schoolId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Grade_schoolId_code_key" ON "Grade"("schoolId", "code");

-- CreateIndex
CREATE INDEX "Classroom_schoolId_gradeId_deletedAt_idx" ON "Classroom"("schoolId", "gradeId", "deletedAt");

-- CreateIndex
CREATE INDEX "Classroom_createdAt_idx" ON "Classroom"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Classroom_schoolId_gradeId_name_key" ON "Classroom"("schoolId", "gradeId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Classroom_schoolId_code_key" ON "Classroom"("schoolId", "code");

-- CreateIndex
CREATE INDEX "Enrollment_schoolId_classroomId_idx" ON "Enrollment"("schoolId", "classroomId");

-- CreateIndex
CREATE INDEX "Enrollment_schoolId_studentId_idx" ON "Enrollment"("schoolId", "studentId");

-- CreateIndex
CREATE INDEX "Enrollment_startedAt_endedAt_idx" ON "Enrollment"("startedAt", "endedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentQuestion_code_key" ON "AssessmentQuestion"("code");

-- CreateIndex
CREATE INDEX "AssessmentQuestion_order_idx" ON "AssessmentQuestion"("order");

-- CreateIndex
CREATE INDEX "AssessmentQuestion_isActive_idx" ON "AssessmentQuestion"("isActive");

-- CreateIndex
CREATE INDEX "AssessmentQuestionIntelligence_intelligenceKey_idx" ON "AssessmentQuestionIntelligence"("intelligenceKey");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentQuestionIntelligence_questionId_intelligenceKey_key" ON "AssessmentQuestionIntelligence"("questionId", "intelligenceKey");

-- CreateIndex
CREATE INDEX "AssignmentQuestion_assignmentId_order_idx" ON "AssignmentQuestion"("assignmentId", "order");

-- CreateIndex
CREATE INDEX "AssignmentQuestion_assignmentId_questionNumber_idx" ON "AssignmentQuestion"("assignmentId", "questionNumber");

-- CreateIndex
CREATE INDEX "AssignmentQuestion_sourceQuestionId_idx" ON "AssignmentQuestion"("sourceQuestionId");

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentQuestion_assignmentId_questionNumber_key" ON "AssignmentQuestion"("assignmentId", "questionNumber");

-- CreateIndex
CREATE INDEX "SchoolAssignment_schoolId_status_idx" ON "SchoolAssignment"("schoolId", "status");

-- CreateIndex
CREATE INDEX "SchoolAssignment_createdById_idx" ON "SchoolAssignment"("createdById");

-- CreateIndex
CREATE INDEX "SchoolAssignment_dueAt_idx" ON "SchoolAssignment"("dueAt");

-- CreateIndex
CREATE INDEX "SchoolAssignment_publishedAt_idx" ON "SchoolAssignment"("publishedAt");

-- CreateIndex
CREATE INDEX "StudentAssignment_studentId_status_idx" ON "StudentAssignment"("studentId", "status");

-- CreateIndex
CREATE INDEX "StudentAssignment_assignmentId_status_idx" ON "StudentAssignment"("assignmentId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAssignment_assignmentId_studentId_key" ON "StudentAssignment"("assignmentId", "studentId");

-- CreateIndex
CREATE INDEX "StudentAnswer_assignmentQuestionId_idx" ON "StudentAnswer"("assignmentQuestionId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAnswer_studentAssignmentId_assignmentQuestionId_key" ON "StudentAnswer"("studentAssignmentId", "assignmentQuestionId");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentResult_studentAssignmentId_key" ON "AssessmentResult"("studentAssignmentId");

-- CreateIndex
CREATE INDEX "AssessmentResult_schoolId_studentId_idx" ON "AssessmentResult"("schoolId", "studentId");

-- CreateIndex
CREATE INDEX "AssessmentResult_dominantKey_idx" ON "AssessmentResult"("dominantKey");

-- CreateIndex
CREATE INDEX "InAppNotification_userId_isRead_createdAt_idx" ON "InAppNotification"("userId", "isRead", "createdAt");

-- CreateIndex
CREATE INDEX "InAppNotification_schoolId_createdAt_idx" ON "InAppNotification"("schoolId", "createdAt");

-- CreateIndex
CREATE INDEX "CounselingSession_schoolId_studentId_idx" ON "CounselingSession"("schoolId", "studentId");

-- CreateIndex
CREATE INDEX "CounselingSession_schoolId_counselorId_idx" ON "CounselingSession"("schoolId", "counselorId");

-- CreateIndex
CREATE INDEX "CounselingSession_studentId_status_idx" ON "CounselingSession"("studentId", "status");

-- CreateIndex
CREATE INDEX "CounselingSession_schoolId_status_idx" ON "CounselingSession"("schoolId", "status");

-- CreateIndex
CREATE INDEX "CounselingSession_schoolId_scheduledAt_idx" ON "CounselingSession"("schoolId", "scheduledAt");

-- CreateIndex
CREATE INDEX "CounselingSession_counselorId_status_idx" ON "CounselingSession"("counselorId", "status");

-- CreateIndex
CREATE INDEX "ParentStudentLink_schoolId_parentId_idx" ON "ParentStudentLink"("schoolId", "parentId");

-- CreateIndex
CREATE INDEX "ParentStudentLink_schoolId_studentId_idx" ON "ParentStudentLink"("schoolId", "studentId");

-- CreateIndex
CREATE INDEX "ParentStudentLink_parentId_isPrimary_idx" ON "ParentStudentLink"("parentId", "isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "ParentStudentLink_parentId_studentId_key" ON "ParentStudentLink"("parentId", "studentId");

-- CreateIndex
CREATE INDEX "StudentGradeRecord_schoolId_studentId_recordedAt_idx" ON "StudentGradeRecord"("schoolId", "studentId", "recordedAt");

-- CreateIndex
CREATE INDEX "StudentGradeRecord_studentId_subject_idx" ON "StudentGradeRecord"("studentId", "subject");

-- CreateIndex
CREATE INDEX "StudentGradeRecord_studentId_termLabel_idx" ON "StudentGradeRecord"("studentId", "termLabel");

-- CreateIndex
CREATE INDEX "StudentActivity_schoolId_studentId_createdAt_idx" ON "StudentActivity"("schoolId", "studentId", "createdAt");

-- CreateIndex
CREATE INDEX "StudentActivity_studentId_type_idx" ON "StudentActivity"("studentId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "ParentResource_slug_key" ON "ParentResource"("slug");

-- CreateIndex
CREATE INDEX "ParentResource_schoolId_category_isPublished_idx" ON "ParentResource"("schoolId", "category", "isPublished");

-- CreateIndex
CREATE INDEX "ParentResource_isPublished_createdAt_idx" ON "ParentResource"("isPublished", "createdAt");

-- CreateIndex
CREATE INDEX "CounselorStudentLink_schoolId_counselorId_status_idx" ON "CounselorStudentLink"("schoolId", "counselorId", "status");

-- CreateIndex
CREATE INDEX "CounselorStudentLink_schoolId_studentId_status_idx" ON "CounselorStudentLink"("schoolId", "studentId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "CounselorStudentLink_schoolId_counselorId_studentId_key" ON "CounselorStudentLink"("schoolId", "counselorId", "studentId");

-- CreateIndex
CREATE INDEX "CounselorReview_schoolId_counselorId_status_idx" ON "CounselorReview"("schoolId", "counselorId", "status");

-- CreateIndex
CREATE INDEX "CounselorReview_schoolId_studentId_idx" ON "CounselorReview"("schoolId", "studentId");

-- CreateIndex
CREATE INDEX "CounselorReview_assignmentId_idx" ON "CounselorReview"("assignmentId");

-- CreateIndex
CREATE INDEX "CounselorReview_resultId_idx" ON "CounselorReview"("resultId");

-- CreateIndex
CREATE INDEX "CounselorNote_schoolId_counselorId_studentId_idx" ON "CounselorNote"("schoolId", "counselorId", "studentId");

-- CreateIndex
CREATE INDEX "CounselorMessageThread_schoolId_counselorId_status_idx" ON "CounselorMessageThread"("schoolId", "counselorId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "CounselorMessageThread_schoolId_counselorId_studentId_key" ON "CounselorMessageThread"("schoolId", "counselorId", "studentId");

-- CreateIndex
CREATE INDEX "CounselorMessage_threadId_createdAt_idx" ON "CounselorMessage"("threadId", "createdAt");

-- CreateIndex
CREATE INDEX "CounselorMessage_senderId_idx" ON "CounselorMessage"("senderId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessRequest" ADD CONSTRAINT "AccessRequest_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessRequest" ADD CONSTRAINT "AccessRequest_approvedUserId_fkey" FOREIGN KEY ("approvedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessRequest" ADD CONSTRAINT "AccessRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessRequest" ADD CONSTRAINT "AccessRequest_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtpCode" ADD CONSTRAINT "OtpCode_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtpCode" ADD CONSTRAINT "OtpCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthSession" ADD CONSTRAINT "AuthSession_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthSession" ADD CONSTRAINT "AuthSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthSession" ADD CONSTRAINT "AuthSession_parentSid_fkey" FOREIGN KEY ("parentSid") REFERENCES "AuthSession"("sid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentQuestionIntelligence" ADD CONSTRAINT "AssessmentQuestionIntelligence_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "AssessmentQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentQuestion" ADD CONSTRAINT "AssignmentQuestion_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "SchoolAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentQuestion" ADD CONSTRAINT "AssignmentQuestion_sourceQuestionId_fkey" FOREIGN KEY ("sourceQuestionId") REFERENCES "AssessmentQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolAssignment" ADD CONSTRAINT "SchoolAssignment_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolAssignment" ADD CONSTRAINT "SchoolAssignment_targetGradeId_fkey" FOREIGN KEY ("targetGradeId") REFERENCES "Grade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolAssignment" ADD CONSTRAINT "SchoolAssignment_targetClassroomId_fkey" FOREIGN KEY ("targetClassroomId") REFERENCES "Classroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolAssignment" ADD CONSTRAINT "SchoolAssignment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolAssignment" ADD CONSTRAINT "SchoolAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAssignment" ADD CONSTRAINT "StudentAssignment_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "SchoolAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAssignment" ADD CONSTRAINT "StudentAssignment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAnswer" ADD CONSTRAINT "StudentAnswer_studentAssignmentId_fkey" FOREIGN KEY ("studentAssignmentId") REFERENCES "StudentAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAnswer" ADD CONSTRAINT "StudentAnswer_assignmentQuestionId_fkey" FOREIGN KEY ("assignmentQuestionId") REFERENCES "AssignmentQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAnswer" ADD CONSTRAINT "StudentAnswer_assessmentQuestionId_fkey" FOREIGN KEY ("assessmentQuestionId") REFERENCES "AssessmentQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentResult" ADD CONSTRAINT "AssessmentResult_studentAssignmentId_fkey" FOREIGN KEY ("studentAssignmentId") REFERENCES "StudentAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentResult" ADD CONSTRAINT "AssessmentResult_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentResult" ADD CONSTRAINT "AssessmentResult_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InAppNotification" ADD CONSTRAINT "InAppNotification_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InAppNotification" ADD CONSTRAINT "InAppNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselingSession" ADD CONSTRAINT "CounselingSession_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselingSession" ADD CONSTRAINT "CounselingSession_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselingSession" ADD CONSTRAINT "CounselingSession_counselorId_fkey" FOREIGN KEY ("counselorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselingSession" ADD CONSTRAINT "CounselingSession_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselingSession" ADD CONSTRAINT "CounselingSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentStudentLink" ADD CONSTRAINT "ParentStudentLink_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentStudentLink" ADD CONSTRAINT "ParentStudentLink_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentStudentLink" ADD CONSTRAINT "ParentStudentLink_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentStudentLink" ADD CONSTRAINT "ParentStudentLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGradeRecord" ADD CONSTRAINT "StudentGradeRecord_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGradeRecord" ADD CONSTRAINT "StudentGradeRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGradeRecord" ADD CONSTRAINT "StudentGradeRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentActivity" ADD CONSTRAINT "StudentActivity_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentActivity" ADD CONSTRAINT "StudentActivity_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentActivity" ADD CONSTRAINT "StudentActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentResource" ADD CONSTRAINT "ParentResource_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselorStudentLink" ADD CONSTRAINT "CounselorStudentLink_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselorStudentLink" ADD CONSTRAINT "CounselorStudentLink_counselorId_fkey" FOREIGN KEY ("counselorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselorStudentLink" ADD CONSTRAINT "CounselorStudentLink_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselorReview" ADD CONSTRAINT "CounselorReview_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselorReview" ADD CONSTRAINT "CounselorReview_counselorId_fkey" FOREIGN KEY ("counselorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselorReview" ADD CONSTRAINT "CounselorReview_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselorReview" ADD CONSTRAINT "CounselorReview_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "SchoolAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselorReview" ADD CONSTRAINT "CounselorReview_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "AssessmentResult"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselorNote" ADD CONSTRAINT "CounselorNote_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselorNote" ADD CONSTRAINT "CounselorNote_counselorId_fkey" FOREIGN KEY ("counselorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselorNote" ADD CONSTRAINT "CounselorNote_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselorMessageThread" ADD CONSTRAINT "CounselorMessageThread_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselorMessageThread" ADD CONSTRAINT "CounselorMessageThread_counselorId_fkey" FOREIGN KEY ("counselorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselorMessageThread" ADD CONSTRAINT "CounselorMessageThread_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselorMessage" ADD CONSTRAINT "CounselorMessage_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "CounselorMessageThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselorMessage" ADD CONSTRAINT "CounselorMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
