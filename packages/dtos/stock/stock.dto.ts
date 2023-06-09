import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class StockDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public symbol: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public date: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public time: string;

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

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  public volume: number;

  constructor(attrs: StockDto) {
    this.close = attrs.close;
    this.date = attrs.date;
    this.high = attrs.high;
    this.low = attrs.low;
    this.name = attrs.name;
    this.open = attrs.open;
    this.symbol = attrs.symbol;
    this.time = attrs.time;
    this.volume = attrs.volume;
  }
}
