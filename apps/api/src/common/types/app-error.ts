import { AuthCode } from "@auth/enums/auth-errors.enum";

export class AppError extends Error {
  constructor(
    public code: AuthCode,
    message?: string,
    public httpStatus: number = 400,
    public meta?: Record<string, any>,
  ) {
    super(message ?? code);
  }
}
