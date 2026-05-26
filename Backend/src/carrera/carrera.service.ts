import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Carrera } from "./carrera.entity";
import { CreateCarreraDto } from "./dto/create-carrera.dto";
import { UpdateCarreraDto } from "./dto/update-carrera.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("Carreras")
@Injectable()
export class CarreraService {
  constructor(
    @InjectRepository(Carrera)
    private carreraRepository: Repository<Carrera>,
  ) {}

  @ApiOperation({ summary: "Crear una nueva carrera" })
  async create(createCarreraDto: CreateCarreraDto): Promise<Carrera> {
    const carrera = this.carreraRepository.create(createCarreraDto);
    return await this.carreraRepository.save(carrera);
  }

  @ApiOperation({ summary: "Obtener todas las carreras" })
  async findAll(): Promise<Carrera[]> {
    return await this.carreraRepository.find();
  }

  @ApiOperation({ summary: "Obtener una carrera por ID" })
  async findOne(id: number): Promise<Carrera> {
    return await this.carreraRepository.findOne({ where: { id } });
  }

  @ApiOperation({ summary: "Actualizar una carrera" })
  async update(
    id: number,
    updateCarreraDto: UpdateCarreraDto,
  ): Promise<Carrera> {
    await this.carreraRepository.update(id, updateCarreraDto);
    return this.findOne(id);
  }

  @ApiOperation({ summary: "Eliminar una carrera" })
  async remove(id: number): Promise<void> {
    await this.carreraRepository.delete(id);
  }
}
