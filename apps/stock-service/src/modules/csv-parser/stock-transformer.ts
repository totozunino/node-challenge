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

  _transform(
    chunk: CSVStock,
    _: BufferEncoding,
    callback: TransformCallback,
  ): void {
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

    callback(null, JSON.stringify(stock));
  }
}
