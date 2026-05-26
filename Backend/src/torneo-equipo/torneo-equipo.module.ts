import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TorneoEquipoService } from "./torneo-equipo.service";
import { TorneoEquipoController } from "./torneo-equipo.controller";
import { TorneoEquipo } from "./torneo-equipo.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TorneoEquipo])],
  controllers: [TorneoEquipoController],
  providers: [TorneoEquipoService],
  exports: [TorneoEquipoService],
})
export class TorneoEquipoModule {}
