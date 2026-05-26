import { IsNumber, IsOptional, IsDateString, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateFixtureDto {
  @ApiProperty({ description: "ID del torneo" })
  @IsNumber()
  torneo_id: number;

  @ApiProperty({ description: "Número de ronda" })
  @IsNumber()
  ronda: number;

  @ApiProperty({ description: "ID del equipo local", required: false })
  @IsOptional()
  @IsNumber()
  equipo_local_id?: number;

  @ApiProperty({ description: "ID del equipo visitante", required: false })
  @IsOptional()
  @IsNumber()
  equipo_visitante_id?: number;

  @ApiProperty({ description: "Fecha y hora del partido", required: false })
  @IsOptional()
  @IsDateString()
  fecha_hora?: string;

  @ApiProperty({ description: "Nombre del estadio", required: false })
  @IsOptional()
  @IsString()
  estadio?: string;

  @ApiProperty({ description: "Resultado del equipo local", required: false })
  @IsOptional()
  @IsNumber()
  resultado_local?: number;

  @ApiProperty({
    description: "Resultado del equipo visitante",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  resultado_visitante?: number;

  @ApiProperty({ description: "ID del siguiente partido", required: false })
  @IsOptional()
  @IsNumber()
  next_match_id?: number;
}
