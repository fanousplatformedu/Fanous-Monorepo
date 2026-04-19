import { registerEnumType } from "@nestjs/graphql";
import * as PC from "@prisma/client";

registerEnumType(PC.CounselorStudentLinkStatus, {
  name: "CounselorStudentLinkStatus",
});

registerEnumType(PC.CounselorReviewStatus, {
  name: "CounselorReviewStatus",
});

registerEnumType(PC.CounselorMessageSenderRole, {
  name: "CounselorMessageSenderRole",
});

registerEnumType(PC.CounselorMessageThreadStatus, {
  name: "CounselorMessageThreadStatus",
});

registerEnumType(PC.CounselorExportFormat, {
  name: "CounselorExportFormat",
});

registerEnumType(PC.CounselingSessionStatus, {
  name: "CounselingSessionStatus",
});

registerEnumType(PC.InAppNotificationType, {
  name: "InAppNotificationType",
});
