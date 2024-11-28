import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column( { unique: true })
  name: string;

  @Column()
  description: string;

  @Column('int', { unsigned: true })
  price: number;

  @Column()
  stock: number;

  @Column()
  category: string;
}
