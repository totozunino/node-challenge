import { Injectable } from '@nestjs/common';
import { CSVParserService } from '../csv-parser/csv-parser.service';
import { StockTransformer } from '../csv-parser/stock-transformer';

@Injectable()
export class StockService {
  constructor(private readonly csvParserService: CSVParserService) {}

  public async getStock(stockCode: string): Promise<StockTransformer> {
    return await this.csvParserService.getStock(stockCode);
  }
}
