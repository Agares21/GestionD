import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { Persona } from "./persona.entity";
import { PersonaRol } from "../persona-rol/persona-rol.entity";
import { CreatePersonaDto } from "./dto/create-persona.dto";
import { UpdatePersonaDto } from "./dto/update-persona.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("Personas")
@Injectable()
export class PersonaService {
  constructor(
    @InjectRepository(Persona)
    private personaRepository: Repository<Persona>,
    @InjectRepository(PersonaRol)
    private personaRolRepository: Repository<PersonaRol>,
  ) {}

  @ApiOperation({ summary: "Crear una nueva persona" })
  async create(createPersonaDto: CreatePersonaDto): Promise<Persona> {
    const personaData = this.normalizePersonaData(createPersonaDto);
    await this.ensureUniquePersona(personaData);

    const persona = this.personaRepository.create(personaData);
    try {
      return await this.personaRepository.save(persona);
    } catch (error: any) {
      this.handleUniqueError(error);
      throw error;
    }
  }

  @ApiOperation({ summary: "Obtener todas las personas" })
  async findAll(): Promise<Persona[]> {
    const personas = await this.personaRepository.find({
      relations: ["roles", "roles.rol"],
    });
    return personas.map((persona) => this.withoutPassword(persona));
  }

  @ApiOperation({ summary: "Obtener una persona por ID" })
  async findOne(id: number): Promise<Persona> {
    const persona = await this.personaRepository.findOne({
      where: { id },
      relations: ["roles", "roles.rol"],
    });
    return persona ? this.withoutPassword(persona) : persona;
  }

  @ApiOperation({ summary: "Actualizar una persona" })
  async update(
    id: number,
    updatePersonaDto: UpdatePersonaDto,
  ): Promise<Persona> {
    const personaData = this.normalizePersonaData(updatePersonaDto);
    await this.ensureUniquePersona(personaData, id);

    try {
      await this.personaRepository.update(id, personaData);
    } catch (error: any) {
      this.handleUniqueError(error);
      throw error;
    }
    return this.findOne(id);
  }

  @ApiOperation({ summary: "Eliminar una persona" })
  async remove(id: number): Promise<void> {
    await this.personaRolRepository.delete({ persona_id: id });
    await this.personaRepository.delete(id);
  }

  private withoutPassword(persona: Persona): Persona {
    const { password: _password, ...safePersona } = persona;
    return safePersona as Persona;
  }

  private normalizePersonaData<T extends Partial<Persona>>(data: T): T {
    return {
      ...data,
      nombre: data.nombre?.trim(),
      apellido: data.apellido?.trim(),
      carnet: data.carnet?.trim(),
      email: data.email?.trim().toLowerCase(),
      celular: data.celular?.trim(),
    };
  }

  private async ensureUniquePersona(
    data: Partial<Persona>,
    currentId?: number,
  ): Promise<void> {
    if (data.email) {
      const existingEmail = await this.personaRepository.findOne({
        where: {
          email: data.email,
          ...(currentId ? { id: Not(currentId) } : {}),
        },
      });

      if (existingEmail) {
        throw new ConflictException("El email ya esta registrado");
      }
    }

    if (data.carnet) {
      const existingCarnet = await this.personaRepository.findOne({
        where: {
          carnet: data.carnet,
          ...(currentId ? { id: Not(currentId) } : {}),
        },
      });

      if (existingCarnet) {
        throw new ConflictException("El carnet ya esta registrado");
      }
    }
  }

  private handleUniqueError(error: any): void {
    if (error?.code !== "23505") {
      return;
    }

    const detail = String(error.detail || "").toLowerCase();

    if (detail.includes("email")) {
      throw new ConflictException("El email ya esta registrado");
    }

    if (detail.includes("carnet")) {
      throw new ConflictException("El carnet ya esta registrado");
    }

    throw new ConflictException("El email o carnet ya esta registrado");
  }
}
