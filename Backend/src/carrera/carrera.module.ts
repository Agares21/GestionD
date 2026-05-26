import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CarreraService } from "./carrera.service";
import { CarreraController } from "./carrera.controller";
import { Carrera } from "./carrera.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Carrera])],
  controllers: [CarreraController],
  providers: [CarreraService],
  exports: [CarreraService],
})
export class CarreraModule {}
