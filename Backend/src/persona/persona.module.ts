import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PersonaService } from "./persona.service";
import { PersonaController } from "./persona.controller";
import { Persona } from "./persona.entity";
import { PersonaRol } from "../persona-rol/persona-rol.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Persona, PersonaRol])],
  controllers: [PersonaController],
  providers: [PersonaService],
  exports: [PersonaService],
})
export class PersonaModule {}
