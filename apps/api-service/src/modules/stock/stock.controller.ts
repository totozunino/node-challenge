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
  ): Promise<Partial<StockResponseDto>> {
    return await this.stockService.getStock(stockCode, userId);
  }
}
