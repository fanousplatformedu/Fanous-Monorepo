import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { S3Client } from "@aws-sdk/client-s3";

@Injectable()
export class S3FactoryService {
  public client: S3Client;
  public bucket: string;
  public acl: string;
  public endpoint: string;
  public region: string;
  public forcePathStyle: boolean;

  constructor(private cfg: ConfigService) {
    this.bucket = this.cfg.get<string>("S3_BUCKET")!;
    this.region = this.cfg.get<string>("S3_REGION") || "us-east-1";
    this.endpoint =
      this.cfg.get<string>("S3_ENDPOINT") || "https://s3.amazonaws.com";
    this.acl = this.cfg.get<string>("S3_ACL") || "private";
    this.forcePathStyle = /^true$/i.test(
      this.cfg.get<string>("S3_FORCE_PATH_STYLE") || "false"
    );

    this.client = new S3Client({
      region: this.region,
      endpoint: this.endpoint,
      forcePathStyle: this.forcePathStyle,
      credentials: {
        accessKeyId: this.cfg.get<string>("S3_ACCESS_KEY")!,
        secretAccessKey: this.cfg.get<string>("S3_SECRET_KEY")!,
      },
    });
  }
}
