import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StockService } from './stock.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  StockResponseDto,
  StockStatsResponseDto,
  UserRole,
} from '@node-challenge/dtos';
import { User } from '../auth/decorators';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/role.guard';

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
  @ApiResponse({ type: StockResponseDto, isArray: true })
  public async getStockHistory(
    @User('sub') userId: string,
  ): Promise<StockResponseDto[]> {
    return await this.stockService.getStockHistory(userId);
  }

  @Get('/stats')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiResponse({ type: StockStatsResponseDto, isArray: true })
  public async getStats(): Promise<StockStatsResponseDto[]> {
    return await this.stockService.getStockStats();
  }
}
