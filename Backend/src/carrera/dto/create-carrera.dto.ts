import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCarreraDto {
  @ApiProperty({ description: "Nombre de la carrera" })
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
