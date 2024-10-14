import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Alert {
  @PrimaryColumn()
  chain: string;

  @Column('decimal', { precision: 10, scale: 2 })
  targetPrice: number;

  @Column()
  email: string;
}