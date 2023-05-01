import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class PasswordRecoveryResponseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public message: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public token: string;
}
