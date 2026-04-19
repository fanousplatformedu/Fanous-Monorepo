import { CounselingSessionStatus, Role, IntelligenceKey } from "@prisma/client";
import { ParentResourceCategory, StudentActivityType } from "@prisma/client";

export type TParentActor = {
  id: string;
  role: Role;
  schoolId: string | null;
};

export type TListMyChildrenArgs = {
  take: number;
  skip: number;
  actor: TParentActor;
  query?: string | null;
};

export type TParentChildScopedArgs = {
  childId: string;
  actor: TParentActor;
};

export type TListParentChildGradesArgs = {
  take: number;
  skip: number;
  childId: string;
  actor: TParentActor;
  query?: string | null;
  subject?: string | null;
  termLabel?: string | null;
};

export type TListParentChildResultsArgs = {
  take: number;
  skip: number;
  childId: string;
  actor: TParentActor;
  query?: string | null;
  dominantIntelligence?: IntelligenceKey | null;
};

export type TCompareParentResultsArgs = {
  childId: string;
  actor: TParentActor;
  baseResultId: string;
  compareWithResultId: string;
};

export type TListParentResourcesArgs = {
  take: number;
  skip: number;
  actor: TParentActor;
  query?: string | null;
  category?: ParentResourceCategory | null;
};

export type TListParentActivitiesArgs = {
  take: number;
  skip: number;
  childId: string;
  actor: TParentActor;
  query?: string | null;
  type?: StudentActivityType | null;
};

export type TListParentCounselingSessionsArgs = {
  take: number;
  skip: number;
  actor: TParentActor;
  query?: string | null;
  childId?: string | null;
  status?: CounselingSessionStatus | null;
};

export type TParentRequestSessionArgs = {
  title: string;
  childId: string;
  actor: TParentActor;
  note?: string | null;
  meetingUrl?: string | null;
  counselorId?: string | null;
  scheduledAt?: string | null;
};

export type TCancelParentSessionArgs = {
  sessionId: string;
  actor: TParentActor;
  reason?: string | null;
};
