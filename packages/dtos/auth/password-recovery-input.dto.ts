import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class PasswordRecoveryInputDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  public email: string;
}
