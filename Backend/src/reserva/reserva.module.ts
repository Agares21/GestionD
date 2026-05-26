import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cancha } from "../cancha/cancha.entity";
import { ReservaController } from "./reserva.controller";
import { Reserva } from "./reserva.entity";
import { ReservaService } from "./reserva.service";

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, Cancha])],
  controllers: [ReservaController],
  providers: [ReservaService],
})
export class ReservaModule {}
