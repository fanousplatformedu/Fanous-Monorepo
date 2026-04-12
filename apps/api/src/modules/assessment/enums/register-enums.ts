import { AssignmentTargetMode, StudentAssignmentStatus } from "@prisma/client";
import { AssignmentStatus, IntelligenceKey } from "@prisma/client";
import { registerEnumType } from "@nestjs/graphql";

registerEnumType(AssignmentStatus, {
  name: "AssignmentStatus",
});

registerEnumType(AssignmentTargetMode, {
  name: "AssignmentTargetMode",
});

registerEnumType(StudentAssignmentStatus, {
  name: "StudentAssignmentStatus",
});

registerEnumType(IntelligenceKey, {
  name: "IntelligenceKey",
});
