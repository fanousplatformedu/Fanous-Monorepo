export type TForcePasswordRole = "SUPER_ADMIN" | "SCHOOL_ADMIN";

export const FORCE_PASSWORD_EVENT = "force-password-flow-changed";

export const isAdminForcePasswordRole = (
  role?: string | null,
): role is TForcePasswordRole =>
  role === "SUPER_ADMIN" || role === "SCHOOL_ADMIN";

export const getSettingsPathByRole = (role?: string | null) => {
  if (role === "SUPER_ADMIN") return "/super-admin/dashboard/settings";
  if (role === "SCHOOL_ADMIN") return "/school-admin/dashboard/settings";
  return "/";
};

export const getDashboardPathByRole = (role?: string | null) => {
  if (role === "SUPER_ADMIN") return "/super-admin/dashboard";
  if (role === "SCHOOL_ADMIN") return "/school-admin/dashboard";
  return "/";
};

export const isAllowedForcePasswordPath = (
  pathname: string,
  role?: string | null,
) => {
  return pathname === getSettingsPathByRole(role);
};

export const FORCE_PASSWORD_PENDING_KEY = "force_password_pending";
export const FORCE_PASSWORD_ROLE_KEY = "force_password_role";
export const FORCE_PASSWORD_RETURN_TO_KEY = "force_password_return_to";
export const FORCE_PASSWORD_LOGIN_PATH_KEY = "force_password_login_path";

const emitForcePasswordChange = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(FORCE_PASSWORD_EVENT));
};

export const setForcePasswordFlow = (params: {
  role: string;
  returnTo?: string | null;
  loginPath?: string | null;
}) => {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(FORCE_PASSWORD_PENDING_KEY, "true");
  sessionStorage.setItem(FORCE_PASSWORD_ROLE_KEY, params.role);

  if (params.returnTo) {
    sessionStorage.setItem(FORCE_PASSWORD_RETURN_TO_KEY, params.returnTo);
  } else {
    sessionStorage.removeItem(FORCE_PASSWORD_RETURN_TO_KEY);
  }

  if (params.loginPath) {
    sessionStorage.setItem(FORCE_PASSWORD_LOGIN_PATH_KEY, params.loginPath);
  } else {
    sessionStorage.removeItem(FORCE_PASSWORD_LOGIN_PATH_KEY);
  }

  emitForcePasswordChange();
};

export const clearForcePasswordFlow = () => {
  if (typeof window === "undefined") return;

  sessionStorage.removeItem(FORCE_PASSWORD_PENDING_KEY);
  sessionStorage.removeItem(FORCE_PASSWORD_ROLE_KEY);
  sessionStorage.removeItem(FORCE_PASSWORD_RETURN_TO_KEY);
  sessionStorage.removeItem(FORCE_PASSWORD_LOGIN_PATH_KEY);

  emitForcePasswordChange();
};

export const getForcePasswordPending = () => {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(FORCE_PASSWORD_PENDING_KEY) === "true";
};

export const getForcePasswordRole = () => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(FORCE_PASSWORD_ROLE_KEY);
};

export const getForcePasswordReturnTo = () => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(FORCE_PASSWORD_RETURN_TO_KEY);
};

export const getForcePasswordLoginPath = () => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(FORCE_PASSWORD_LOGIN_PATH_KEY);
};
