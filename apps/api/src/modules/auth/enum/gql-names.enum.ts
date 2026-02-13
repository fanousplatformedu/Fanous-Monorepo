export enum GqlQueryNames {
  AUTH_LOGOUT = "authLogout",
  AUTH_VERIFY_OTP = "authVerifyOtp",
  AUTH_REQUEST_OTP = "authRequestOtp",
  AUTH_REFRESH_TOKEN = "authRefreshToken",
  AUTH_REGISTER_REQUEST = "authRegisterRequest",
}

export enum GqlInputNames {
  AUTH_VERIFY_OTP_INPUT = "AuthVerifyOtpInput",
  AUTH_REQUEST_OTP_INPUT = "AuthRequestOtpInput",
  AUTH_REFRESH_TOKEN_INPUT = "AuthRefreshTokenInput",
  AUTH_REGISTER_REQUEST_INPUT = "AuthRegisterRequestInput",
}

export enum GqlEntityNames {
  AUTH_PAYLOAD = "AuthPayload",
  AUTH_REGISTER_STATUS = "AuthRegisterStatus",
}
