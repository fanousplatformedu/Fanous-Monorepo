import { TMockQueue } from "@jobs/types/jobs.types";

export const createMockQueue = (): TMockQueue => ({
  add: jest.fn().mockResolvedValue({ id: "job-1" }),
  getWaitingCount: jest.fn().mockResolvedValue(0),
});
