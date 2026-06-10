import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Torneo } from "./torneo.entity";
import { CreateTorneoDto } from "./dto/create-torneo.dto";
import { UpdateTorneoDto } from "./dto/update-torneo.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("Torneos")
@Injectable()
export class TorneoService {
  constructor(
    @InjectRepository(Torneo)
    private torneoRepository: Repository<Torneo>,
    private dataSource: DataSource,
  ) {}

  @ApiOperation({ summary: "Crear un nuevo torneo" })
  async create(createTorneoDto: CreateTorneoDto): Promise<Torneo> {
    const torneo = this.torneoRepository.create(createTorneoDto);
    return await this.torneoRepository.save(torneo);
  }

  @ApiOperation({ summary: "Obtener todos los torneos" })
  async findAll(): Promise<Torneo[]> {
    return await this.torneoRepository.find({
      relations: ["disciplina"],
    });
  }

  @ApiOperation({ summary: "Obtener un torneo por ID" })
  async findOne(id: number): Promise<Torneo> {
    const torneo = await this.torneoRepository.findOne({
      where: { id },
      relations: ["disciplina"],
    });

    if (!torneo) {
      throw new NotFoundException("Torneo no encontrado");
    }

    return torneo;
  }

  @ApiOperation({ summary: "Actualizar un torneo" })
  async update(id: number, updateTorneoDto: UpdateTorneoDto): Promise<Torneo> {
    await this.findOne(id);
    await this.torneoRepository.update(id, updateTorneoDto);
    return this.findOne(id);
  }

  @ApiOperation({ summary: "Eliminar un torneo" })
  async remove(id: number): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from("fixture")
      .where("torneo_id = :id", { id })
      .execute();
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from("torneo_equipo")
      .where("torneo_id = :id", { id })
      .execute();
    await this.torneoRepository.delete(id);
  }
}
