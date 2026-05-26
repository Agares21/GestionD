import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { join } from "path";

// Módulos
import { AuthModule } from "./auth/auth.module";
import { CarreraModule } from "./carrera/carrera.module";
import { DisciplinaModule } from "./disciplina/disciplina.module";
import { PersonaModule } from "./persona/persona.module";
import { RolModule } from "./rol/rol.module";
import { PersonaRolModule } from "./persona-rol/persona-rol.module";
import { DelegadoCarreraModule } from "./delegado-carrera/delegado-carrera.module";
import { EquipoModule } from "./equipo/equipo.module";
import { JugadorEquipoModule } from "./jugador-equipo/jugador-equipo.module";
import { TorneoModule } from "./torneo/torneo.module";
import { FixtureModule } from "./fixture/fixture.module";
import { TorneoEquipoModule } from "./torneo-equipo/torneo-equipo.module";
import { CanchaModule } from "./cancha/cancha.module";
import { ReservaModule } from "./reserva/reserva.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5433", 10),
      username: process.env.DB_USER || "postgres",
      password: process.env.DB_PASS || "admin",
      database: process.env.DB_NAME || "gestionD",
      entities: [join(__dirname, "**", "*.entity{.ts,.js}")],
      synchronize: process.env.NODE_ENV !== "production",
      logging: false,
    }),
    AuthModule,
    CarreraModule,
    DisciplinaModule,
    PersonaModule,
    RolModule,
    PersonaRolModule,
    DelegadoCarreraModule,
    EquipoModule,
    JugadorEquipoModule,
    TorneoModule,
    FixtureModule,
    TorneoEquipoModule,
    CanchaModule,
    ReservaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
