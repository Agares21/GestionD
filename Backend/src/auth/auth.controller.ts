import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from "@nestjs/swagger";

@ApiTags("Autenticación")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiOperation({ summary: "Iniciar sesión" })
  @ApiResponse({ status: 200, description: "Login exitoso, retorna JWT" })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("register")
  @ApiOperation({ summary: "Registrar nuevo usuario" })
  @ApiResponse({ status: 201, description: "Usuario registrado exitosamente" })
  async register(
    @Body()
    registerData: {
      nombre: string;
      apellido: string;
      carnet: string;
      email: string;
      celular: string;
      password: string;
      rol?: string;
    },
  ) {
    const { password, rol, ...personaData } = registerData;
    const persona = await this.authService.register(personaData, password, rol);
    return {
      id: persona.id,
      nombre: persona.nombre,
      apellido: persona.apellido,
      email: persona.email,
      mensaje: "Usuario registrado exitosamente",
    };
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Obtener perfil del usuario autenticado" })
  getProfile(@Request() req: any) {
    return {
      id: req.user.id,
      email: req.user.email,
      roles: req.user.roles,
    };
  }
}
