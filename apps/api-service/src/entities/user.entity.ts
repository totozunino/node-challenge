import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StockHistory } from './stock-history.entity';
import { UserRole } from '@node-challenge/dtos';

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

  @Column({ nullable: true })
  public refreshToken: string;

  @Column({ nullable: true })
  public resetPasswordToken: string;

  @Column({ nullable: true })
  public resetPasswordExpires: Date;

  @OneToMany(() => StockHistory, (stockHistory) => stockHistory.user, {
    eager: false,
  })
  public stockHistory: StockHistory[];
}
