import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./jwt.strategy";
import { RolesGuard } from "./roles.guard";
import { Persona } from "../persona/persona.entity";
import { PersonaRol } from "../persona-rol/persona-rol.entity";
import { Rol } from "../rol/rol.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Persona, PersonaRol, Rol]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret:
          configService.get("JWT_SECRET") ||
          "your_jwt_secret_key_change_in_production",
        signOptions: {
          expiresIn: "24h",
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
  exports: [AuthService],
})
export class AuthModule {}
