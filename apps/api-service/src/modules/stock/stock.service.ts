import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockHistory } from '../../entities';
import { Repository } from 'typeorm';
import axios from 'axios';
import { StockDto, StockResponseDto } from '@node-challenge/dtos';
import stockServiceConfig from 'src/config/stock-service.config';
import { ConfigType } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockHistory)
    private readonly stockHistoryRepository: Repository<StockHistory>,
    @Inject(stockServiceConfig.KEY)
    private readonly stockServiceConfiguration: ConfigType<
      typeof stockServiceConfig
    >,
    private readonly userService: UserService,
  ) {}

  public async getStock(
    stockCode: string,
    userId: string,
  ): Promise<StockResponseDto> {
    const { data } = await axios.get<StockDto>(
      this.stockServiceConfiguration.url,
      { params: { stockCode } },
    );

    const user = await this.userService.getUserOrThrow({
      where: {
        id: userId,
      },
    });

    const stock = this.stockHistoryRepository.create({
      close: data.close,
      high: data.high,
      low: data.low,
      name: data.name,
      open: data.open,
      symbol: data.symbol,
      date: new Date(data.date + ' ' + data.time),
      user: user,
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
