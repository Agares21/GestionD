import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Fixture } from "./fixture.entity";
import { CreateFixtureDto } from "./dto/create-fixture.dto";
import { UpdateFixtureDto } from "./dto/update-fixture.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("Fixtures")
@Injectable()
export class FixtureService {
  constructor(
    @InjectRepository(Fixture)
    private fixtureRepository: Repository<Fixture>,
  ) {}

  @ApiOperation({ summary: "Crear un nuevo partido" })
  async create(createFixtureDto: CreateFixtureDto): Promise<Fixture> {
    const fixture = this.fixtureRepository.create(createFixtureDto);
    return await this.fixtureRepository.save(fixture);
  }

  @ApiOperation({ summary: "Obtener todos los partidos" })
  async findAll(): Promise<Fixture[]> {
    return await this.fixtureRepository.find({
      relations: ["equipoLocal", "equipoVisitante"],
      order: { id: "ASC" },
    });
  }

  @ApiOperation({ summary: "Obtener un partido por ID" })
  async findOne(id: number): Promise<Fixture> {
    return await this.fixtureRepository.findOne({
      where: { id },
      relations: ["equipoLocal", "equipoVisitante"],
    });
  }

  @ApiOperation({ summary: "Obtener partidos de un torneo" })
  async findByTorneo(torneoId: number): Promise<Fixture[]> {
    return await this.fixtureRepository.find({
      where: { torneo_id: torneoId },
      relations: ["equipoLocal", "equipoVisitante"],
      order: { ronda: "ASC" },
    });
  }

  @ApiOperation({ summary: "Actualizar un partido" })
  async update(
    id: number,
    updateFixtureDto: UpdateFixtureDto,
  ): Promise<Fixture> {
    await this.fixtureRepository.update(id, updateFixtureDto);
    return this.findOne(id);
  }

  @ApiOperation({ summary: "Eliminar un partido" })
  async remove(id: number): Promise<void> {
    await this.fixtureRepository.delete(id);
  }
}
