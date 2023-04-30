import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenInputDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public refreshToken: string;
}
