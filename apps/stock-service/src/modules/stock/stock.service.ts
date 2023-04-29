import { Injectable } from '@nestjs/common';
import { CSVParserService } from '../csv-parser/csv-parser.service';
import { Transform } from 'stream';

@Injectable()
export class StockService {
  constructor(private readonly csvParserService: CSVParserService) {}

  public async getStock(stockCode: string): Promise<Transform> {
    return await this.csvParserService.getStock(stockCode);
  }
}
