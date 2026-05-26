import { IsString, IsNotEmpty, IsEmail, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePersonaDto {
  @ApiProperty({ description: "Nombre de la persona" })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ description: "Apellido de la persona" })
  @IsString()
  @IsNotEmpty()
  apellido: string;

  @ApiProperty({ description: "Número de carnet" })
  @IsString()
  @IsNotEmpty()
  carnet: string;

  @ApiProperty({ description: "Email (debe ser @ucb.edu.bo" })
  @IsEmail()
  @Matches(/@ucb\.edu\.bo$/, {
    message: "El email debe ser del dominio @ucb.edu.bo",
  })
  email: string;

  @ApiProperty({ description: "Número de celular" })
  @IsString()
  @IsNotEmpty()
  celular: string;
}
