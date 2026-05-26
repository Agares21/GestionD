import { IsDateString, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateReservaDto {
  @IsNumber()
  cancha_id: number;

  @IsNumber()
  @IsOptional()
  equipo_id?: number;

  @IsDateString()
  fecha: string;

  @IsString()
  @IsNotEmpty()
  hora_inicio: string;

  @IsString()
  @IsNotEmpty()
  hora_fin: string;

  @IsIn(["confirmada", "pendiente", "cancelada"])
  @IsOptional()
  estado?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;
}
