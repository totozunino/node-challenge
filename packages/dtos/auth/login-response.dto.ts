import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginResponseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public accessToken: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public refreshToken: string;
}
