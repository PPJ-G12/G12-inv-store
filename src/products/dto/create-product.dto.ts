import { IsString, IsNumber, IsPositive, IsInt, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsPositive()
  @IsInt()
  price: number;

  @IsNumber()
  @IsPositive()
  @IsInt()
  stock: number;

  @IsString()
  category: string;
}
