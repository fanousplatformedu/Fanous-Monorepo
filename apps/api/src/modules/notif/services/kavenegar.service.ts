import { BadGatewayException, Injectable, Logger } from "@nestjs/common";
import { ServiceUnavailableException } from "@nestjs/common";
import { TKavenegarVerifyLookupArgs } from "@notif/types/notif.types";
import { TKavenegarSendSmsArgs } from "@notif/types/notif.types";
import { ConfigService } from "@nestjs/config";

import Kavenegar from "kavenegar";

@Injectable()
export class KavenegarService {
  private readonly logger = new Logger(KavenegarService.name);

  private readonly apiKey: string;
  private readonly sender: string;
  private readonly smsEnabled: boolean;
  private readonly devFallback: boolean;
  private readonly api: any | null;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>("KAVENEGAR_API_KEY") ?? "";
    this.sender = this.configService.get<string>("KAVENEGAR_SENDER") ?? "";
    this.smsEnabled =
      (this.configService.get<string>("KAVENEGAR_SMS_ENABLED") ?? "false") ===
      "true";
    this.devFallback =
      (this.configService.get<string>("KAVENEGAR_DEV_FALLBACK") ?? "true") ===
      "true";
    this.api = this.apiKey
      ? Kavenegar.KavenegarApi({
          apikey: this.apiKey,
        })
      : null;
  }

  isConfigured(): boolean {
    return !!this.apiKey && !!this.api;
  }

  normalizeIranMobile(input: string): string {
    const value = input.trim().replace(/\s+/g, "");
    if (value.startsWith("+98")) return `0${value.slice(3)}`;
    if (value.startsWith("0098")) return `0${value.slice(4)}`;
    if (value.startsWith("98") && value.length === 12)
      return `0${value.slice(2)}`;
    return value;
  }

  async sendSms(args: TKavenegarSendSmsArgs): Promise<{
    providerMessageId?: string;
  }> {
    const receptor = this.normalizeIranMobile(args.to);
    const sender = args.sender ?? this.sender;
    if (!this.smsEnabled || !this.isConfigured()) {
      if (this.devFallback) {
        this.logger.warn(
          `[DEV SMS FALLBACK] receptor=${receptor} sender=${sender} message=${args.message}`,
        );
        return {};
      }
      throw new ServiceUnavailableException("Kavenegar SMS is not configured.");
    }
    if (!sender)
      throw new ServiceUnavailableException(
        "Kavenegar sender is not configured.",
      );
    return await new Promise<{ providerMessageId?: string }>(
      (resolve, reject) => {
        this.api.Send(
          {
            receptor,
            sender,
            message: args.message,
          },
          (response: any, status: number) => {
            const providerStatus =
              typeof response?.return?.status === "number"
                ? response.return.status
                : status;
            if (providerStatus >= 200 && providerStatus < 300) {
              resolve({
                providerMessageId:
                  response?.entries?.[0]?.messageid?.toString?.() ?? undefined,
              });
              return;
            }
            this.logger.error(
              `Kavenegar Send failed. status=${status} providerStatus=${providerStatus} response=${JSON.stringify(response)}`,
            );
            reject(
              new BadGatewayException("Failed to send SMS via Kavenegar."),
            );
          },
        );
      },
    );
  }

  async verifyLookup(args: TKavenegarVerifyLookupArgs): Promise<void> {
    const receptor = this.normalizeIranMobile(args.receptor);
    if (!this.smsEnabled || !this.isConfigured()) {
      if (this.devFallback) {
        this.logger.warn(
          `[DEV VERIFY LOOKUP FALLBACK] receptor=${receptor} token=${args.token} token2=${args.token2 ?? ""} token3=${args.token3 ?? ""} template=${args.template}`,
        );
        return;
      }
      throw new ServiceUnavailableException("Kavenegar SMS is not configured.");
    }
    return await new Promise<void>((resolve, reject) => {
      this.api.VerifyLookup(
        {
          receptor,
          token: args.token,
          token2: args.token2,
          token3: args.token3,
          template: args.template,
        },
        (response: any, status: number) => {
          this.logger.error(
            `Kavenegar VerifyLookup callback: status=${status}, response=${JSON.stringify(response)}`,
          );

          const providerStatus =
            typeof response?.return?.status === "number"
              ? response.return.status
              : status;

          if (providerStatus >= 200 && providerStatus < 300) {
            resolve();
            return;
          }

          reject(
            new BadGatewayException(
              `Failed to send verify SMS via Kavenegar. providerStatus=${providerStatus}`,
            ),
          );
        },
      );
    });
  }
}
