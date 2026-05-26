import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDisciplinaDto {
  @ApiProperty({ description: "Nombre de la disciplina" })
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
