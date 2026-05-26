import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JugadorEquipo } from "./jugador-equipo.entity";
import { CreateJugadorEquipoDto } from "./dto/create-jugador-equipo.dto";
import { Equipo } from "../equipo/equipo.entity";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("Jugadores-Equipos")
@Injectable()
export class JugadorEquipoService {
  constructor(
    @InjectRepository(JugadorEquipo)
    private jugadorEquipoRepository: Repository<JugadorEquipo>,
    @InjectRepository(Equipo)
    private equipoRepository: Repository<Equipo>,
  ) {}

  @ApiOperation({ summary: "Agregar un jugador a un equipo" })
  async create(
    createJugadorEquipoDto: CreateJugadorEquipoDto,
  ): Promise<JugadorEquipo> {
    // Verificar si el jugador ya pertenece a otra carrera
    const existing = await this.jugadorEquipoRepository.findOne({
      where: { jugador_id: createJugadorEquipoDto.jugador_id },
      relations: ["equipo"],
    });

    if (existing) {
      // Verificar si es otra carrera
      const newEquipo = await this.equipoRepository.findOne({
        where: { id: createJugadorEquipoDto.equipo_id },
      });

      if (
        newEquipo &&
        existing.equipo &&
        newEquipo.carrera_id !== existing.equipo.carrera_id
      ) {
        throw new BadRequestException(
          "Un jugador no puede participar en equipos de diferentes carreras",
        );
      }
    }

    const jugadorEquipo = this.jugadorEquipoRepository.create(
      createJugadorEquipoDto,
    );
    return await this.jugadorEquipoRepository.save(jugadorEquipo);
  }

  @ApiOperation({ summary: "Obtener todos los jugadores-equipos" })
  async findAll(): Promise<JugadorEquipo[]> {
    return await this.jugadorEquipoRepository.find({
      relations: ["jugador", "equipo"],
    });
  }

  @ApiOperation({ summary: "Obtener jugadores de un equipo" })
  async findByEquipo(equipoId: number): Promise<JugadorEquipo[]> {
    return await this.jugadorEquipoRepository.find({
      where: { equipo_id: equipoId },
      relations: ["jugador"],
    });
  }

  @ApiOperation({ summary: "Obtener equipos de un jugador" })
  async findByJugador(jugadorId: number): Promise<JugadorEquipo[]> {
    return await this.jugadorEquipoRepository.find({
      where: { jugador_id: jugadorId },
      relations: ["equipo", "equipo.carrera", "equipo.disciplina"],
    });
  }

  @ApiOperation({ summary: "Eliminar un jugador de un equipo" })
  async remove(jugadorId: number, equipoId: number): Promise<void> {
    await this.jugadorEquipoRepository.delete({
      jugador_id: jugadorId,
      equipo_id: equipoId,
    });
  }
}
