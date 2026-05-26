import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Rol } from "./rol.entity";
import { CreateRolDto } from "./dto/create-rol.dto";
import { UpdateRolDto } from "./dto/update-rol.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("Roles")
@Injectable()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,
  ) {}

  @ApiOperation({ summary: "Crear un nuevo rol" })
  async create(createRolDto: CreateRolDto): Promise<Rol> {
    const rol = this.rolRepository.create(createRolDto);
    return await this.rolRepository.save(rol);
  }

  @ApiOperation({ summary: "Obtener todos los roles" })
  async findAll(): Promise<Rol[]> {
    return await this.rolRepository.find();
  }

  @ApiOperation({ summary: "Obtener un rol por ID" })
  async findOne(id: number): Promise<Rol> {
    return await this.rolRepository.findOne({ where: { id } });
  }

  @ApiOperation({ summary: "Actualizar un rol" })
  async update(id: number, updateRolDto: UpdateRolDto): Promise<Rol> {
    await this.rolRepository.update(id, updateRolDto);
    return this.findOne(id);
  }

  @ApiOperation({ summary: "Eliminar un rol" })
  async remove(id: number): Promise<void> {
    await this.rolRepository.delete(id);
  }
}
