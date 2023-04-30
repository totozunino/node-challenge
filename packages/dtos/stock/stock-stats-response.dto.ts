import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class StockStatsResponseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public stock: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  public timesRequested: number;
}
