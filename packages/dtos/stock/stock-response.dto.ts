import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class StockResponseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public symbol: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  public open: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  public high: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  public low: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  public close: number;
}
