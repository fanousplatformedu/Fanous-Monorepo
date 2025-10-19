import { Controller, Get, Request, Res, UseGuards } from "@nestjs/common";
import { LinkedInAuthGuard } from "@guards/linkedin-auth.guard";
import { FacebookAuthGuard } from "@guards/facebook-auth.guard";
import { GoogleAuthGuard } from "@guards/google-auth.guard";
import { ConfigService } from "@nestjs/config";
import { JwtAuthGuard } from "@guards/jwt-auth.guard";
import { AuthService } from "@auth/services/auth.service";
import { Response } from "express";
import { Public } from "@decorators/public.decorator";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService
  ) {}

  private redirectOk(res: Response, userData: any) {
    const base =
      this.config.get<string>("OAUTH_REDIRECT_URL") ||
      this.config.get<string>("GOOGLE_REDIRECT_URL")!;
    const redirectUrl =
      `${base}?` +
      new URLSearchParams({
        userId: String(userData.id),
        name: userData.name ?? "",
        avatar: userData.avatar ?? "",
        accessToken: userData.accessToken,
        role: userData.role,
      }).toString();
    res.redirect(redirectUrl);
  }

  private redirectError(res: Response, e: any) {
    const base =
      this.config.get<string>("OAUTH_REDIRECT_URL") ||
      this.config.get<string>("GOOGLE_REDIRECT_URL")!;
    const code = e?.extensions?.code ?? "INVALID_ROLE";
    const actualRole = e?.extensions?.actualRole ?? "";
    const redirectUrl =
      `${base}?` +
      new URLSearchParams({
        error: String(code),
        actualRole: String(actualRole),
      }).toString();
    res.redirect(redirectUrl);
  }

  // ========= Google =============
  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get("google/login")
  googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get("google/callback")
  async googleCallback(@Request() req, @Res() res: Response) {
    try {
      const data = await this.authService.login(req.user);
      this.redirectOk(res, data);
    } catch (e) {
      this.redirectError(res, e);
    }
  }

  // ========== Linkedin ============
  @Public()
  @UseGuards(LinkedInAuthGuard)
  @Get("linkedin/login")
  linkedinLogin() {}

  @Public()
  @UseGuards(LinkedInAuthGuard)
  @Get("linkedin/callback")
  async linkedinCallback(@Request() req, @Res() res: Response) {
    try {
      const data = await this.authService.login(req.user);
      this.redirectOk(res, data);
    } catch (e) {
      this.redirectError(res, e);
    }
  }

  // ============ Facebook ============
  @Public()
  @UseGuards(FacebookAuthGuard)
  @Get("facebook/login")
  facebookLogin() {}

  @Public()
  @UseGuards(FacebookAuthGuard)
  @Get("facebook/callback")
  async facebookCallback(@Request() req, @Res() res: Response) {
    try {
      const data = await this.authService.login(req.user);
      this.redirectOk(res, data);
    } catch (e) {
      this.redirectError(res, e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get("verify-token")
  verify() {
    return "ok";
  }
}
