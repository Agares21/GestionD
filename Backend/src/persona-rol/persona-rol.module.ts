import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PersonaRolService } from "./persona-rol.service";
import { PersonaRolController } from "./persona-rol.controller";
import { PersonaRol } from "./persona-rol.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PersonaRol])],
  controllers: [PersonaRolController],
  providers: [PersonaRolService],
  exports: [PersonaRolService],
})
export class PersonaRolModule {}
