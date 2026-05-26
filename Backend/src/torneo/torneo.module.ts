import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TorneoService } from "./torneo.service";
import { TorneoController } from "./torneo.controller";
import { Torneo } from "./torneo.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Torneo])],
  controllers: [TorneoController],
  providers: [TorneoService],
  exports: [TorneoService],
})
export class TorneoModule {}
