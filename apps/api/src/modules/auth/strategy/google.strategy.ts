import { Strategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { StrategyOptionsWithRequest } from "passport-google-oauth20";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../services/auth.service";
import { Injectable } from "@nestjs/common";
import { Role } from "src/common/enums/role.enum";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    private readonly config: ConfigService,
    private readonly auth: AuthService
  ) {
    super({
      clientID: config.get<string>("GOOGLE_CLIENT_ID")!,
      clientSecret: config.get<string>("GOOGLE_CLIENT_SECRET")!,
      callbackURL: config.get<string>("GOOGLE_CALLBACK_URL")!,
      scope: ["email", "profile"],
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ): Promise<void> {
    const email = profile.emails?.[0]?.value ?? "";
    const avatar = profile.photos?.[0]?.value ?? "";
    const name = profile.displayName ?? "";

    const roleFromState = (
      req?.query?.state ??
      req?.body?.state ??
      req?.query?.role ??
      ""
    )
      .toString()
      .toUpperCase();
    const role = (Role as any)[roleFromState] ?? Role.PROFESSIONAL;

    try {
      const user = await this.auth.validateOAuthUser({
        role,
        name,
        email,
        avatar,
        password: "",
      });
      return done(null, user);
    } catch (e) {
      return done(e as any, undefined);
    }
  }
}
