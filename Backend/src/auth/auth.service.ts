import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
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
    const normalizedEmail = email.trim().toLowerCase();
    const persona = await this.personaRepository.findOne({
      where: { email: normalizedEmail },
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
    const normalizedPersonaData = {
      ...personaData,
      nombre: personaData.nombre?.trim(),
      apellido: personaData.apellido?.trim(),
      carnet: personaData.carnet?.trim(),
      email: personaData.email?.trim().toLowerCase(),
      celular: personaData.celular?.trim(),
    };

    if (!password?.trim()) {
      throw new BadRequestException("La contrasena es obligatoria");
    }

    const existingPersona = await this.personaRepository.findOne({
      where: [
        { email: normalizedPersonaData.email },
        { carnet: normalizedPersonaData.carnet },
      ],
    });

    if (existingPersona?.email === normalizedPersonaData.email) {
      throw new ConflictException("El email ya esta registrado");
    }

    if (existingPersona?.carnet === normalizedPersonaData.carnet) {
      throw new ConflictException("El carnet ya esta registrado");
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const persona = this.personaRepository.create({
      ...normalizedPersonaData,
      password: hashedPassword,
    });

    let savedPersona: Persona;
    try {
      savedPersona = await this.personaRepository.save(persona);
    } catch (error: any) {
      if (error?.code === "23505") {
        throw new ConflictException("El email o carnet ya esta registrado");
      }
      throw error;
    }
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
