import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockHistory } from '../../entities';
import { Repository } from 'typeorm';
import axios from 'axios';
import { StockDto, StockResponseDto } from '@node-challenge/dtos';
import stockServiceConfig from 'src/config/stock-service.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockHistory)
    private stockHistoryRepository: Repository<StockHistory>,
    @Inject(stockServiceConfig.KEY)
    private readonly stockServiceConfiguration: ConfigType<
      typeof stockServiceConfig
    >,
  ) {}

  public async getStock(stockCode: string): Promise<StockResponseDto> {
    const { data } = await axios.get<StockDto>(
      this.stockServiceConfiguration.url,
      { params: { stockCode } },
    );

    const stock = this.stockHistoryRepository.create({
      close: data.close,
      high: data.high,
      low: data.low,
      name: data.name,
      open: data.open,
      symbol: data.symbol,
      date: new Date(data.date + ' ' + data.time),
    });

    const { name, symbol, open, high, low, close } =
      await this.stockHistoryRepository.save(stock);

    return {
      name,
      symbol,
      open,
      high,
      low,
      close,
    };
  }
}
