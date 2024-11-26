import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from "typeorm";
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RpcException } from '@nestjs/microservices';
import { PaginationDto } from "../common";

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

  async findAll(paginationDto: PaginationDto): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationDto; // Valores por defecto si no se especifican

    const [data, total] = await this.productsRepository.findAndCount({
      skip: (page - 1) * limit, // Calcular el offset
      take: limit, // Límite de resultados
    });

    return {
      data,
      total, // Total de elementos sin paginar
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Product> {
    console.log('Finding product with ID:', id); // Log para depurar
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Product with ID ${id} not found`,
      });
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id); // Verifica que el producto existe

    // Excluye el campo `id` y filtra valores nulos o indefinidos
    // @ts-ignore
    const { id: _, ...data } = updateProductDto;
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined && value !== null)
    );

    if (Object.keys(updateData).length === 0) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'No valid fields to update',
      });
    }

    // Realiza la actualización
    const result = await this.productsRepository.update(id, updateData);

    if (result.affected === 0) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Product with ID ${id} not found`,
      });
    }

    // Retorna el producto actualizado
    return this.findOne(id);
  }

  async remove(id: number): Promise<string> {
    await this.findOne(id);
    await this.productsRepository.delete(id);
    return "Se ha eliminado el producto con éxito";
  }

  async validateProduct(ids: number[]): Promise<Product[]> {
    const validProducts = await this.productsRepository.findBy({ id: In(ids) });

    // Extraer los ids de los productos encontrados
    const foundIds = validProducts.map(product => product.id);

    // Identificar los ids que faltan comparando con los ids originales
    const missingIds = ids.filter(id => !foundIds.includes(id));

    // Si hay ids faltantes, lanzar una excepción
    if (missingIds.length > 0) {
      throw new RpcException({
        message: "Some products were not found!",
        status: HttpStatus.BAD_REQUEST,
      });
    }

    // Retornar los productos válidos si todos los ids existen
    return validProducts;
  }
  
}
