import { Strategy, StrategyOptionWithRequest } from "passport-linkedin-oauth2";
import { PassportStrategy } from "@nestjs/passport";
import { VerifyCallback } from "passport-oauth2";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../services/auth.service";
import { Injectable } from "@nestjs/common";
import { Profile } from "passport";
import { Role } from "src/common/enums/role.enum";

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, "linkedin") {
  constructor(
    private readonly config: ConfigService,
    private readonly auth: AuthService
  ) {
    super({
      clientID: config.get<string>("LINKEDIN_CLIENT_ID")!,
      clientSecret: config.get<string>("LINKEDIN_CLIENT_SECRET")!,
      callbackURL: config.get<string>("LINKEDIN_CALLBACK_URL")!,
      scope: ["r_emailaddress", "r_liteprofile"],
      passReqToCallback: true,
      state: true,
    } as StrategyOptionWithRequest);
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ): Promise<void> {
    const email = profile.emails?.[0]?.value || "";
    const avatar = profile.photos?.[0]?.value || "";
    const name =
      profile.displayName ||
      `${profile.name?.givenName ?? ""} ${profile.name?.familyName ?? ""}`.trim();

    const roleFromState = (req?.query?.state ?? req?.body?.state ?? "")
      .toString()
      .toUpperCase();
    const role = (Role as any)[roleFromState] ?? Role.PROFESSIONAL;

    try {
      const user = await this.auth.validateOAuthUser({
        name,
        role,
        email,
        avatar,
        password: "",
      });
      return done(null, user);
    } catch (e) {
      return done(e as any);
    }
  }
}
