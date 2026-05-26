import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Disciplina } from "./disciplina.entity";
import { CreateDisciplinaDto } from "./dto/create-disciplina.dto";
import { UpdateDisciplinaDto } from "./dto/update-disciplina.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("Disciplinas")
@Injectable()
export class DisciplinaService {
  constructor(
    @InjectRepository(Disciplina)
    private disciplinaRepository: Repository<Disciplina>,
  ) {}

  @ApiOperation({ summary: "Crear una nueva disciplina" })
  async create(createDisciplinaDto: CreateDisciplinaDto): Promise<Disciplina> {
    const disciplina = this.disciplinaRepository.create(createDisciplinaDto);
    return await this.disciplinaRepository.save(disciplina);
  }

  @ApiOperation({ summary: "Obtener todas las disciplinas" })
  async findAll(): Promise<Disciplina[]> {
    return await this.disciplinaRepository.find();
  }

  @ApiOperation({ summary: "Obtener una disciplina por ID" })
  async findOne(id: number): Promise<Disciplina> {
    return await this.disciplinaRepository.findOne({ where: { id } });
  }

  @ApiOperation({ summary: "Actualizar una disciplina" })
  async update(
    id: number,
    updateDisciplinaDto: UpdateDisciplinaDto,
  ): Promise<Disciplina> {
    await this.disciplinaRepository.update(id, updateDisciplinaDto);
    return this.findOne(id);
  }

  @ApiOperation({ summary: "Eliminar una disciplina" })
  async remove(id: number): Promise<void> {
    await this.disciplinaRepository.delete(id);
  }
}
