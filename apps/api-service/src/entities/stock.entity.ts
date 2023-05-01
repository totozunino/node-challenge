import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StockHistory } from './stock-history.entity';

@Entity()
export class Stock extends BaseEntity {
  @Column()
  public name: string;

  @Column()
  public symbol: string;

  @OneToMany(() => StockHistory, (stockHistory) => stockHistory.stock, {
    eager: false,
  })
  public stockHistory: StockHistory[];
}
