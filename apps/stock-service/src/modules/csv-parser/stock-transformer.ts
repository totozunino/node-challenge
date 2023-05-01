import { NotFoundException } from '@nestjs/common';
import { StockDto } from '@node-challenge/dtos';
import { validate, validateSync } from 'class-validator';
import { Transform, TransformCallback } from 'stream';

interface CSVStock {
  Symbol: string;
  Date: string;
  Time: string;
  Open: string;
  High: string;
  Low: string;
  Close: string;
  Volume: string;
  Name: string;
}

export class StockTransformer extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  public _transform(
    chunk: CSVStock,
    _: BufferEncoding,
    callback: TransformCallback,
  ): void {
    try {
      const stock = this.buildStock(chunk);
      callback(null, JSON.stringify(stock));
    } catch (error) {
      callback(error as Error);
    }
  }

  private buildStock(chunk: CSVStock): StockDto {
    if (Object.values(chunk).includes('N/D')) {
      throw new NotFoundException();
    }

    const stock = {
      symbol: chunk.Symbol,
      date: chunk.Date,
      time: chunk.Time,
      open: parseFloat(chunk.Open),
      high: parseFloat(chunk.High),
      low: parseFloat(chunk.Low),
      close: parseFloat(chunk.Close),
      volume: parseInt(chunk.Volume, 10),
      name: chunk.Name,
    };

    const stockDto = new StockDto(stock);
    const errors = validateSync(stockDto);

    if (errors.length > 0) {
      throw new Error('Invalid CSV format');
    }

    return stockDto;
  }
}
