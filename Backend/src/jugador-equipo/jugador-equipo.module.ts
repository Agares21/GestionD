import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JugadorEquipoService } from "./jugador-equipo.service";
import { JugadorEquipoController } from "./jugador-equipo.controller";
import { JugadorEquipo } from "./jugador-equipo.entity";
import { Equipo } from "../equipo/equipo.entity";

@Module({
  imports: [TypeOrmModule.forFeature([JugadorEquipo, Equipo])],
  controllers: [JugadorEquipoController],
  providers: [JugadorEquipoService],
  exports: [JugadorEquipoService],
})
export class JugadorEquipoModule {}
