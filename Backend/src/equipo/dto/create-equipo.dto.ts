import { IsString, IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateEquipoDto {
  @ApiProperty({ description: "Nombre del equipo" })
  @IsString()
  @IsNotEmpty()
  nombre_equipo: string;

  @ApiProperty({ description: "ID de la carrera" })
  @IsNumber()
  carrera_id: number;

  @ApiProperty({ description: "ID de la disciplina" })
  @IsNumber()
  disciplina_id: number;
}
