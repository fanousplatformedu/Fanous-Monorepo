export enum AuthMessageEnum {
  // Authentication & Authorization
  INVALID_TOKEN = "Invalid token",
  TOKEN_EXPIRED = "Token has expired",
  INVALID_CREDENTIALS = "Invalid credentials",
  UNAUTHORIZED = "Unauthorized access",
  FORBIDDEN = "Access denied",

  // OTP & Rate Limiting
  INVALID_OTP = "Invalid OTP code",
  OTP_EXPIRED = "OTP has expired",
  OTP_NOT_FOUND = "OTP not found or expired",
  TOO_MANY_REQUESTS = "Too many requests. Please try again later.",
  INVALID_MOBILE = "Invalid mobile number.",

  // General
  BAD_REQUEST = "Invalid request parameters",
  INTERNAL_ERROR = "Internal server error",
  OPERATION_FAILED = "Operation failed",
  NOT_FOUND = "Resource not found",
}
