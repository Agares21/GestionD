import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DelegadoCarrera } from "./delegado-carrera.entity";
import { CreateDelegadoCarreraDto } from "./dto/create-delegado-carrera.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("Delegados-Carrera")
@Injectable()
export class DelegadoCarreraService {
  constructor(
    @InjectRepository(DelegadoCarrera)
    private delegadoCarreraRepository: Repository<DelegadoCarrera>,
  ) {}

  @ApiOperation({ summary: "Asignar un delegado a una carrera" })
  async create(
    createDelegadoCarreraDto: CreateDelegadoCarreraDto,
  ): Promise<DelegadoCarrera> {
    const delegado = this.delegadoCarreraRepository.create(
      createDelegadoCarreraDto,
    );
    return await this.delegadoCarreraRepository.save(delegado);
  }

  @ApiOperation({ summary: "Obtener todos los delegados por carrera" })
  async findAll(): Promise<DelegadoCarrera[]> {
    return await this.delegadoCarreraRepository.find({
      relations: ["persona", "carrera"],
    });
  }

  @ApiOperation({ summary: "Obtener el delegado de una carrera" })
  async findByCarrera(carreraId: number): Promise<DelegadoCarrera | null> {
    return await this.delegadoCarreraRepository.findOne({
      where: { carrera_id: carreraId },
      relations: ["persona"],
    });
  }

  @ApiOperation({ summary: "Eliminar un delegado de una carrera" })
  async remove(personaId: number, carreraId: number): Promise<void> {
    await this.delegadoCarreraRepository.delete({
      persona_id: personaId,
      carrera_id: carreraId,
    });
  }
}
