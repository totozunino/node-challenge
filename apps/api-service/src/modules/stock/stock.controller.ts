import { Controller, Get, Query } from '@nestjs/common';
import { StockService } from './stock.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StockResponseDto } from '@node-challenge/dtos';
import { User } from '../auth/decorators';

@Controller('stocks')
@ApiTags('stocks')
@ApiBearerAuth()
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  @ApiResponse({ type: StockResponseDto })
  public async getStock(
    @User('sub') userId: string,
    @Query('stockCode') stockCode: string,
  ): Promise<StockResponseDto> {
    return await this.stockService.getStock(stockCode, userId);
  }

  @Get('/history')
  @ApiResponse({ type: StockResponseDto })
  public async getStockHistory(
    @User('sub') userId: string,
  ): Promise<StockResponseDto[]> {
    return await this.stockService.getStockHistory(userId);
  }
}
