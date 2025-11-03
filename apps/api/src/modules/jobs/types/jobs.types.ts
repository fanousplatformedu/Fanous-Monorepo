export type Actor = { id: string; role: string };

export type QueuePayload<T = any> = {
  params?: string;
  tenantId: string;
} & T;

export type TMockQueue = {
  add: jest.Mock;
  getWaitingCount: jest.Mock;
};
