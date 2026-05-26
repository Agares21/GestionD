import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CanchaController } from "./cancha.controller";
import { Cancha } from "./cancha.entity";
import { CanchaService } from "./cancha.service";

@Module({
  imports: [TypeOrmModule.forFeature([Cancha])],
  controllers: [CanchaController],
  providers: [CanchaService],
})
export class CanchaModule {}
