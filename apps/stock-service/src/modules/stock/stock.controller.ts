import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
  Res,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { StockService } from './stock.service';
import { Response } from 'express';
import { StockResponseDto } from '@node-challenge/dtos';

@Controller('stocks')
@ApiTags('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  @ApiResponse({
    type: StockResponseDto,
  })
  public async getStock(
    @Query('stockCode') stockCode: string,
    @Res() res: Response,
  ): Promise<void> {
    res.setHeader('Content-Type', 'application/json');

    const data = await this.stockService.getStock(stockCode);

    data.on('error', () => {
      res.status(500).send(new InternalServerErrorException().getResponse());
    });

    data.pipe(res);
  }
}
