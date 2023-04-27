import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class StockHistory extends BaseEntity {
  /*
   The name and symbol of the stock can be abstracted to their on Stock entity with the idea of avoiding data redundancy.
   However, for the sake of simplicity, we will keep the name and symbol as part of the StockHistory entity.
   */
  @Column()
  public name: string;

  @Column()
  public symbol: string;

  @Column()
  public date: Date;

  @Column()
  public open: number;

  @Column()
  public high: number;

  @Column()
  public low: number;

  @Column()
  public close: number;

  @ManyToOne(() => User, (user) => user.stockHistory, { eager: false })
  public user: User;
}
