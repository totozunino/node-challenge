import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockHistory } from '../../entities';
import { Repository } from 'typeorm';
import axios from 'axios';
import {
  StockDto,
  StockResponseDto,
  StockStatsResponseDto,
} from '@node-challenge/dtos';
import stockServiceConfig from '../../config/stock-service.config';
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

  public async getStockHistory(userId: string): Promise<StockResponseDto[]> {
    const stockHistory = await this.stockHistoryRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return stockHistory.map((stock) => ({
      createdAt: stock.createdAt,
      name: stock.name,
      symbol: stock.symbol,
      open: stock.open,
      high: stock.high,
      low: stock.low,
      close: stock.close,
    }));
  }

  public async getStockStats(): Promise<StockStatsResponseDto[]> {
    const stockStats = await this.stockHistoryRepository
      .createQueryBuilder('sh')
      .select('sh.symbol')
      .addSelect('count(sh.symbol) as count')
      .groupBy('sh.symbol')
      .limit(5)
      .getRawMany();

    return stockStats.map((stock) => {
      return {
        stock: stock.sh_symbol,
        timesRequested: stock.count,
      };
    });
  }
}
