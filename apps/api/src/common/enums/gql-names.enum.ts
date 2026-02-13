/* ============== Entities =============== */
export const enum GqlObjectNames {
  // Auth / User
  USER = "UserEntity",
  AUTH_PAYLOAD = "AuthPayloadEntity",
}

/* =============== DTOs =============== */
export const enum GqlInputNames {
  // Auth / User
  SIGN_IN = "SignInInput",
  UPDATE_ME = "UpdateMeInput",
  VERIFY_OTP = "VerifyOtpInput",
  CREATE_USER = "CreateUserInput",
  REQUEST_OTP = "RequestOtpInput",
}

// ================ Query Name ================
export const QueryNames = {
  // Auth
  SIGN_UP: "signUp",
  SIGN_IN: "signIn",
  REQUEST_OTP: "requestOtp",
  VERIFY_OTP: "verifyOtp",

  // User
  ME: "me",
  UPDATE_ME: "updateMe",
  CREATE_USER: "createUser",
  HEALTH_CHECK: "healthCheck",
} as const;
