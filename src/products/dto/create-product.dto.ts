import { IsString, IsNumber, IsPositive, IsInt, MinLength, IsUrl } from "class-validator";

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsUrl()
  image: string;

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
