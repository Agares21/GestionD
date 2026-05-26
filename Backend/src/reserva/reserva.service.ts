import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Reserva } from "./reserva.entity";

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
  ) {}

  create(data: Partial<Reserva>) {
    return this.reservaRepository.save(this.reservaRepository.create(data));
  }

  findAll(fecha?: string, equipoId?: number) {
    return this.reservaRepository.find({
      where: {
        ...(fecha ? { fecha } : {}),
        ...(equipoId ? { equipo_id: equipoId } : {}),
      },
      relations: ["cancha", "equipo"],
      order: { fecha: "ASC", hora_inicio: "ASC" },
    });
  }

  findOne(id: number) {
    return this.reservaRepository.findOne({
      where: { id },
      relations: ["cancha", "equipo"],
    });
  }

  async update(id: number, data: Partial<Reserva>) {
    await this.reservaRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.reservaRepository.delete(id);
  }
}
