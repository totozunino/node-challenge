import {
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Query,
  Res,
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { StockService } from './stock.service';
import { Response } from 'express';
import { StockDto } from '@node-challenge/dtos';

@Controller('stocks')
@ApiTags('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  @ApiResponse({
    type: StockDto,
  })
  @ApiOperation({
    summary: 'Get stock',
    description: `It get the stock's data from the external API`,
  })
  public async getStock(
    @Query('stockCode') stockCode: string,
    @Res() res: Response,
  ): Promise<void> {
    res.setHeader('Content-Type', 'application/json');

    try {
      const data = await this.stockService.getStock(stockCode);

      for await (const chunk of data) {
        if (chunk.includes('N/D')) {
          res.status(404).send(new NotFoundException().getResponse());
        } else {
          res.send(chunk);
        }
      }
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.getStatus()).send(error.getResponse());
      } else {
        res.status(500).send(new InternalServerErrorException().getResponse());
      }
    }
  }
}
