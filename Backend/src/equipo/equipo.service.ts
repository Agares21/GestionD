import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Equipo } from "./equipo.entity";
import { CreateEquipoDto } from "./dto/create-equipo.dto";
import { UpdateEquipoDto } from "./dto/update-equipo.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { DataSource } from "typeorm";

@ApiTags("Equipos")
@Injectable()
export class EquipoService {
  constructor(
    @InjectRepository(Equipo)
    private equipoRepository: Repository<Equipo>,
    private dataSource: DataSource,
  ) {}

  @ApiOperation({ summary: "Crear un nuevo equipo" })
  async create(createEquipoDto: CreateEquipoDto): Promise<Equipo> {
    const equipo = this.equipoRepository.create(createEquipoDto);
    return await this.equipoRepository.save(equipo);
  }

  @ApiOperation({ summary: "Obtener todos los equipos" })
  async findAll(): Promise<Equipo[]> {
    return await this.equipoRepository.find({
      relations: ["carrera", "disciplina"],
    });
  }

  @ApiOperation({ summary: "Obtener un equipo por ID" })
  async findOne(id: number): Promise<Equipo> {
    return await this.equipoRepository.findOne({
      where: { id },
      relations: ["carrera", "disciplina", "jugadores"],
    });
  }

  @ApiOperation({ summary: "Obtener equipos por carrera y disciplina" })
  async findByCarreraAndDisciplina(
    carreraId: number,
    disciplinaId: number,
  ): Promise<Equipo | null> {
    return await this.equipoRepository.findOne({
      where: { carrera_id: carreraId, disciplina_id: disciplinaId },
      relations: ["carrera", "disciplina"],
    });
  }

  @ApiOperation({ summary: "Actualizar un equipo" })
  async update(id: number, updateEquipoDto: UpdateEquipoDto): Promise<Equipo> {
    await this.equipoRepository.update(id, updateEquipoDto);
    return this.findOne(id);
  }

  @ApiOperation({ summary: "Eliminar un equipo" })
  async remove(id: number): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from("jugador_equipo")
      .where("equipo_id = :id", { id })
      .execute();
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from("torneo_equipo")
      .where("equipo_id = :id", { id })
      .execute();
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from("fixture")
      .where("equipo_local_id = :id OR equipo_visitante_id = :id", { id })
      .execute();
    await this.equipoRepository.delete(id);
  }
}
