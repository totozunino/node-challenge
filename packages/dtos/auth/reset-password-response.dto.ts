import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class ResetPasswordResponseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public message: string;
}
