import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cancha } from "./cancha.entity";

@Injectable()
export class CanchaService {
  constructor(
    @InjectRepository(Cancha)
    private canchaRepository: Repository<Cancha>,
  ) {}

  create(data: Partial<Cancha>) {
    return this.canchaRepository.save(this.canchaRepository.create(data));
  }

  findAll() {
    return this.canchaRepository.find({ order: { id: "ASC" } });
  }

  findOne(id: number) {
    return this.canchaRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<Cancha>) {
    await this.canchaRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.canchaRepository.delete(id);
  }
}
