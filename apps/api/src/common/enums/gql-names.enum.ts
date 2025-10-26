/* ============== Entities =============== */
export const enum GqlObjectNames {
  // Auth / User
  AUTH_PAYLOAD = "AuthPayloadEntity",
  USER = "UserEntity",
}

/* =============== DTOs =============== */
export const enum GqlInputNames {
  // Auth / User
  CREATE_USER = "CreateUserInput",
  UPDATE_ME = "UpdateMeInput",
  SIGN_IN = "SignInInput",

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
