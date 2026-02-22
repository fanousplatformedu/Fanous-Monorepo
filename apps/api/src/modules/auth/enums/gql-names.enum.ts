export enum GqlInputNames {
  AdminLoginInput = "AdminLoginInput",
  RequestOtpInput = "RequestOtpInput",
  VerifyOtpInput = "VerifyOtpInput",
}

export enum GqlObjectNames {
  AuthPayload = "AuthPayload",
  OtpResponse = "OtpResponse",
  LogoutResult = "LogoutResult",
}

export enum GqlMutationNames {
  Logout = "logout",
  Refresh = "refreshAuth",
  VerifyOtp = "verifyOtp",
  LogoutAll = "logoutAll",
  AdminLogin = "adminLogin",
  RequestOtp = "requestOtp",
  HealthCheck = "HealthCheck",
}
