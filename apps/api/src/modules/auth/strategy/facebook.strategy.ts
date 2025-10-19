import { StrategyOptionWithRequest } from "passport-linkedin-oauth2";
import { Strategy, Profile } from "passport-facebook";
import { PassportStrategy } from "@nestjs/passport";
import { VerifyCallback } from "passport-oauth2";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../services/auth.service";
import { Injectable } from "@nestjs/common";
import { Role } from "src/common/enums/role.enum";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
  constructor(
    private readonly config: ConfigService,
    private readonly auth: AuthService
  ) {
    super({
      clientID: config.get<string>("FACEBOOK_CLIENT_ID")!,
      clientSecret: config.get<string>("FACEBOOK_CLIENT_SECRET")!,
      callbackURL: config.get<string>("FACEBOOK_CALLBACK_URL")!,
      profileFields: ["id", "emails", "name", "displayName", "photos"],
      passReqToCallback: true,
      enableProof: true,
    } as StrategyOptionWithRequest);
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ): Promise<void> {
    const email = (profile.emails && profile.emails[0]?.value) || "";
    const avatar = (profile.photos && profile.photos[0]?.value) || "";
    const name =
      profile.displayName ||
      `${profile.name?.givenName ?? ""} ${profile.name?.familyName ?? ""}`.trim();

    const roleFromState = (req?.query?.state ?? req?.body?.state ?? "")
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
      return done(e as any);
    }
  }
}
