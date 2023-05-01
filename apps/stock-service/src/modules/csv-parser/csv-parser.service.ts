import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Readable } from 'stream';
import { parse } from 'csv-parse';
import { StockTransformer } from './stock-transformer';
import { STOCK_API_URL } from './constants';

/*

    The CSVParserService is responsible for parsing the CSV file, this can be implemented in various ways
    In this case I decided to implement it using the stream API, this way we can parse the file in chunks
    and stream it to the response more efficiently.

*/

@Injectable()
export class CSVParserService {
  private async getStockStream(stockCode: string): Promise<Readable> {
    const { data } = await axios.get<Readable>(STOCK_API_URL, {
      responseType: 'stream',
      params: {
        s: stockCode,
        f: 'sd2t2ohlcvn',
        h: '',
        e: 'csv',
      },
    });

    return data;
  }

  public async getStock(stockCode: string): Promise<StockTransformer> {
    const parser = parse({ delimiter: ',', to: 1, columns: true });
    const stockTransformer = new StockTransformer();

    return (await this.getStockStream(stockCode))
      .pipe(parser)
      .pipe(stockTransformer);
  }
}
