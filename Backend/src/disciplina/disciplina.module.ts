import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DisciplinaService } from "./disciplina.service";
import { DisciplinaController } from "./disciplina.controller";
import { Disciplina } from "./disciplina.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Disciplina])],
  controllers: [DisciplinaController],
  providers: [DisciplinaService],
  exports: [DisciplinaService],
})
export class DisciplinaModule {}
