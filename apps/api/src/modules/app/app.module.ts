import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AccessRequestModule } from "@accessRequest/access-request.module";
import { NotificationModule } from "@notif/notif.module";
import { GraphQLModule } from "@nestjs/graphql";
import { PrismaModule } from "@prisma/prisma.module";
import { SchoolModule } from "@school/school.module";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { AuthModule } from "@auth/auth.module";
import { RolesGuard } from "@auth/guards/roles.guard";
import { UserModule } from "@user/user.module";
import { APP_GUARD } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { join } from "path";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    SchoolModule,
    NotificationModule,
    AccessRequestModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), "src/graphql/schema.gql"),
        sortSchema: true,
        playground: config.get("NODE_ENV") !== "production",
        context: ({ req, res }) => ({ req, res }),
      }),
    }),
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
