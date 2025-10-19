import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app/app.module";

function isString(x: unknown): x is string {
  return typeof x === "string" && x.length > 0;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());

  const PORT = parseInt(process.env.PORT ?? "5700", 10);
  const selfOrigin = `http://localhost:${PORT}`;

  const envList = (config.get<string>("ALLOWED_ORIGINS") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(isString);

  const defaultAllowed = [
    config.get<string>("FRONT_URL"),
    selfOrigin,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ].filter(isString);

  const allowed = new Set<string>([...defaultAllowed, ...envList]);

  app.enableCors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (/^https:\/\/studio\.apollographql\.com$/.test(origin))
        return cb(null, true);
      if (allowed.has(origin)) return cb(null, true);
      console.warn("CORS blocked origin:", origin, "Allowed:", [...allowed]);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  await app.listen(PORT);
  console.log(`🚀 Server is running on ${selfOrigin}`);
}

bootstrap();
