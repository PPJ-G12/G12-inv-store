import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    console.log('Finding product with ID:', id); // Log para depurar
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new RpcException(`Product with ID ${id} not found`);
    }
    console.log('Product found:', product); // Log para verificar
    return product;
  }
  

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.productsRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  
  async remove(id: number): Promise<void> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new RpcException(`Product with ID ${id} not found`);
    }
    await this.productsRepository.delete(id);
  }

  
  

  async searchByName(name?: string) {
    const query = this.productsRepository.createQueryBuilder('product');
  
    // Si se proporciona un nombre, buscar nombres similares
    if (name) {
      query.where('product.name ILIKE :name', { name: `%${name}%` });
    }
  
    return query.getMany();
  }
  
  
}
