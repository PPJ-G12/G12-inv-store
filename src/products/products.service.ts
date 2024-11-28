import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from "typeorm";
import { Product } from './entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto';
import { RpcException } from '@nestjs/microservices';
import { PaginationDto } from "../common";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { name } = createProductDto;
    const product = await this.productsRepository.findOne({ where: { name } });
    if (product) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        message: 'Product with this name already exists',
      });
    }
    const newProduct = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(newProduct);
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
    // Verifica que el producto existe antes de actualizar
    await this.findOne(id);

    await this.productsRepository.update(id, updateProductDto);

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
