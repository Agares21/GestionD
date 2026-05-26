import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTorneoDto {
  @ApiProperty({ description: "Nombre del torneo" })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ description: "Tipo de torneo (Interno o Externo)" })
  @IsString()
  tipo: string;

  @ApiProperty({ description: "ID de la disciplina" })
  @IsNumber()
  disciplina_id: number;

  @ApiProperty({ description: "Fecha de inicio", required: false })
  @IsOptional()
  @IsDateString()
  fecha_inicio?: string;

  @ApiProperty({ description: "Fecha de fin", required: false })
  @IsOptional()
  @IsDateString()
  fecha_fin?: string;

  @ApiProperty({ description: "URL de la imagen", required: false })
  @IsOptional()
  @IsString()
  imagen_url?: string;
}
