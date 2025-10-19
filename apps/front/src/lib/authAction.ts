"use server";

import { TGqlSignInRes, TGqlSignUpRes, TRoleUnion } from "@/types/actions";
import { SIGN_USER_MUTATION, SIGN_IN_MUTATION } from "./gql";
import { SignInFormSchema, SignUpFormSchema } from "./AuthSchemas";
import { TSignInFormStateWithRedirect } from "@/types/actions";
import { getErrorMessage } from "@/utils/function-helpers";
import { SignUpFormState } from "@/types/formState";
import { createSession } from "./session";
import { fetchGraphQL } from "./fetchGraphQL";
import { print } from "graphql";
import { Role } from "@/types/auth";

// ============= signUp Action ================
export const signUp = async (
  _state: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> => {
  const rawValues = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: (formData.get("role") as string) || "PROFESSIONAL",
  };

  const parsed = SignUpFormSchema.safeParse(rawValues);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      data: {
        name: String(rawValues.name ?? ""),
        email: String(rawValues.email ?? ""),
        password: String(rawValues.password ?? ""),
      },
      error: {
        name: fieldErrors.name,
        email: fieldErrors.email ?? ["Email is required"],
        password: fieldErrors.password,
      },
      message: "Please correct the highlighted fields",
    };
  }

  try {
    const res = await fetchGraphQL<
      TGqlSignUpRes,
      { input: { name: string; email: string; password: string; role: Role } }
    >(print(SIGN_USER_MUTATION), {
      input: {
        ...parsed.data,
        role: (rawValues.role as Role) || "PROFESSIONAL",
      },
    });
    const userData = res.signUp;
    await createSession({
      accessToken: userData.accessToken,
      googleCalendarEnabled: userData.googleCalendarEnabled,
      user: {
        id: userData.id,
        name: userData.name,
        role: userData.role,
        avatar: userData.avatar ?? undefined,
      },
    });

    return {
      success: true,
      data: { ...parsed.data },
      error: { name: [], email: [], password: [] },
      message: "Account created and logged in successfully!",
    };
  } catch (err) {
    console.error("Signup error:", err);
    const message =
      err instanceof Error && err.message === "User already exists"
        ? "This email is already registered"
        : "Signup failed. Please try again later.";

    return {
      data: { ...parsed.data },
      error: { email: [message] },
      message,
    };
  }
};

// ============= signIn Action ================
export const signIn = async (
  _prev: TSignInFormStateWithRedirect | undefined,
  formData: FormData
): Promise<TSignInFormStateWithRedirect> => {
  const rawValues: {
    email: FormDataEntryValue | null;
    password: FormDataEntryValue | null;
    role: FormDataEntryValue | null;
  } = {
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  };

  const parsed = SignInFormSchema.safeParse({
    email: rawValues.email,
    password: rawValues.password,
    role: rawValues.role,
  });

  if (!parsed.success) {
    const fe = parsed.error.flatten().fieldErrors;
    return {
      data: {
        email: String(rawValues.email ?? ""),
        password: String(rawValues.password ?? ""),
      },
      error: {
        email: fe.email ?? ["Email is required"],
        password: fe.password,
      },
      message: "Please correct the highlighted fields",
    };
  }

  try {
    const res = await fetchGraphQL<
      TGqlSignInRes,
      { input: { email: string; password: string; role: TRoleUnion } }
    >(print(SIGN_IN_MUTATION), { input: parsed.data });

    const user = res.signIn;
    await createSession({
      accessToken: user.accessToken,
      googleCalendarEnabled: user.googleCalendarEnabled,
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        avatar: user.avatar ?? undefined,
      },
    });

    return {
      success: true,
      data: { email: parsed.data.email, password: parsed.data.password },
      error: { email: [], password: [] },
      message: "Login successful!",
    };
  } catch (err: unknown) {
    const msg = getErrorMessage(err);
    const isRoleError =
      msg.includes("INVALID_ROLE") || msg.includes("Role mismatch");

    if (isRoleError) {
      const attempted = parsed.data.role as TRoleUnion;
      const target =
        attempted === "PROVIDER" ? "/auth/professional" : "/auth/provider";
      return {
        data: { email: parsed.data.email, password: parsed.data.password },
        error: { email: ["This email belongs to another role. Redirected."] },
        message:
          "This email belongs to another role. Please use the correct login.",
        redirectTo: target,
      };
    }
    return {
      data: {
        email: String(rawValues.email ?? ""),
        password: String(rawValues.password ?? ""),
      },
      message: "Authentication error",
      error: { email: ["Login failed. Invalid email or password."] },
    };
  }
};
