import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { Persona } from "../persona/persona.entity";
import { PersonaRol } from "../persona-rol/persona-rol.entity";
import { Rol } from "../rol/rol.entity";
import { LoginDto } from "./dto/login.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("Auth")
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Persona)
    private personaRepository: Repository<Persona>,
    @InjectRepository(PersonaRol)
    private personaRolRepository: Repository<PersonaRol>,
    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,
    private jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: "Validar usuario y contraseña" })
  async validateUser(email: string, password: string): Promise<any> {
    const persona = await this.personaRepository.findOne({
      where: { email },
    });

    if (!persona || !persona.password) {
      return null;
    }

    const match = await bcrypt.compare(password, persona.password);
    if (!match) {
      return null;
    }

    // Obtener roles
    const personaRoles = await this.personaRolRepository.find({
      where: { persona_id: persona.id },
      relations: ["rol"],
    });

    const roles = personaRoles.map((pr) => this.normalizeRole(pr.rol.nombre));
    const { password: _pw, ...result } = persona;
    return { ...result, roles };
  }

  private normalizeRole(role: string): string {
    const roles: Record<string, string> = {
      Administrador: "ADMIN",
      Delegado: "DELEGADO",
      Jugador: "JUGADOR",
    };

    return roles[role] || role.toUpperCase();
  }

  private toDatabaseRole(role?: string): string {
    const roles: Record<string, string> = {
      ADMIN: "Administrador",
      ADMINISTRADOR: "Administrador",
      DELEGADO: "Delegado",
      JUGADOR: "Jugador",
    };

    return roles[role?.toUpperCase() || ""] || "Jugador";
  }

  @ApiOperation({ summary: "Iniciar sesión" })
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    const payload = {
      email: user.email,
      sub: user.id,
      roles: user.roles,
    };

    const usuario = {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      roles: user.roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario,
      user: usuario,
    };
  }

  @ApiOperation({ summary: "Registrar un nuevo usuario" })
  async register(
    personaData: Partial<Persona>,
    password: string,
    role?: string,
  ): Promise<Persona> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const persona = this.personaRepository.create({
      ...personaData,
      password: hashedPassword,
    });

    const savedPersona = await this.personaRepository.save(persona);
    const selectedRole = await this.rolRepository.findOne({
      where: { nombre: this.toDatabaseRole(role) },
    });

    if (selectedRole) {
      await this.personaRolRepository.save({
        persona_id: savedPersona.id,
        rol_id: selectedRole.id,
      });
    }

    return savedPersona;
  }
}
