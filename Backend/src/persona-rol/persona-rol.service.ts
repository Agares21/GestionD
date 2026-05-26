import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PersonaRol } from "./persona-rol.entity";
import { CreatePersonaRolDto } from "./dto/create-persona-rol.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("Persona-Rol")
@Injectable()
export class PersonaRolService {
  constructor(
    @InjectRepository(PersonaRol)
    private personaRolRepository: Repository<PersonaRol>,
  ) {}

  @ApiOperation({ summary: "Asignar un rol a una persona" })
  async create(createPersonaRolDto: CreatePersonaRolDto): Promise<PersonaRol> {
    const personaRol = this.personaRolRepository.create(createPersonaRolDto);
    return await this.personaRolRepository.save(personaRol);
  }

  @ApiOperation({ summary: "Obtener todas las relaciones persona-rol" })
  async findAll(): Promise<PersonaRol[]> {
    return await this.personaRolRepository.find({
      relations: ["persona", "rol"],
    });
  }

  @ApiOperation({ summary: "Obtener roles de una persona" })
  async findByPersona(personaId: number): Promise<PersonaRol[]> {
    return await this.personaRolRepository.find({
      where: { persona_id: personaId },
      relations: ["rol"],
    });
  }

  @ApiOperation({ summary: "Eliminar un rol de una persona" })
  async remove(personaId: number, rolId: number): Promise<void> {
    await this.personaRolRepository.delete({
      persona_id: personaId,
      rol_id: rolId,
    });
  }
}
