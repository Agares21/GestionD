import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DelegadoCarreraService } from "./delegado-carrera.service";
import { DelegadoCarreraController } from "./delegado-carrera.controller";
import { DelegadoCarrera } from "./delegado-carrera.entity";

@Module({
  imports: [TypeOrmModule.forFeature([DelegadoCarrera])],
  controllers: [DelegadoCarreraController],
  providers: [DelegadoCarreraService],
  exports: [DelegadoCarreraService],
})
export class DelegadoCarreraModule {}
