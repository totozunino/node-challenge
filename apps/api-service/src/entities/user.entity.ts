import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StockHistory } from './stock-history.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User extends BaseEntity {
  @Column({ nullable: false, unique: true })
  public email: string;

  @Column()
  public password: string;

  @Column({
    type: 'simple-enum',
    enum: UserRole,
  })
  public role: UserRole;

  @OneToMany(() => StockHistory, (stockHistory) => stockHistory.user, {
    eager: false,
  })
  public stockHistory: StockHistory[];
}
