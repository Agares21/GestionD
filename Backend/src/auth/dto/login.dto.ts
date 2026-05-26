import { IsString, IsNotEmpty, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ description: "Email del usuario" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Contraseña" })
  @IsString()
  @IsNotEmpty()
  password: string;
}
