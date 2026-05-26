import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TorneoEquipo } from "./torneo-equipo.entity";
import { CreateTorneoEquipoDto } from "./dto/create-torneo-equipo.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("Torneo-Equipos")
@Injectable()
export class TorneoEquipoService {
  constructor(
    @InjectRepository(TorneoEquipo)
    private torneoEquipoRepository: Repository<TorneoEquipo>,
  ) {}

  @ApiOperation({ summary: "Agregar equipo a torneo" })
  async create(
    createTorneoEquipoDto: CreateTorneoEquipoDto,
  ): Promise<TorneoEquipo> {
    const torneoEquipo = this.torneoEquipoRepository.create(
      createTorneoEquipoDto,
    );
    return await this.torneoEquipoRepository.save(torneoEquipo);
  }

  @ApiOperation({ summary: "Obtener todos los equipos por torneo" })
  async findAll(): Promise<TorneoEquipo[]> {
    return await this.torneoEquipoRepository.find({
      relations: ["torneo", "equipo"],
    });
  }

  @ApiOperation({ summary: "Obtener equipos de un torneo" })
  async findByTorneo(torneoId: number): Promise<TorneoEquipo[]> {
    return await this.torneoEquipoRepository.find({
      where: { torneo_id: torneoId },
      relations: ["equipo"],
    });
  }

  @ApiOperation({ summary: "Eliminar equipo de torneo" })
  async remove(torneoId: number, equipoId: number): Promise<void> {
    await this.torneoEquipoRepository.delete({
      torneo_id: torneoId,
      equipo_id: equipoId,
    });
  }
}
