import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateCanchaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  ubicacion?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  capacidad?: number;

  @IsString()
  @IsOptional()
  tipo_superficie?: string;

  @IsIn(["disponible", "ocupada", "mantenimiento"])
  @IsOptional()
  estado?: string;
}
