import { Controller, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller()
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);
  constructor(private readonly productsService: ProductsService) {}
  
  @MessagePattern('createProduct')
  async create(@Payload() createProductDto: CreateProductDto) {
    try {
      // Validar entrada adicional si es necesario
      if (!createProductDto.name || createProductDto.price <= 0) {
        throw new BadRequestException('Invalid product data');
      }

      return await this.productsService.create(createProductDto);
    } catch (error) {
      this.logger.error(`Error creating product: ${error.message}`);
      throw new RpcException(error.message); // Retornar el error al cliente
    }
  }

  @MessagePattern('findAllProducts')
  async findAll() {
    try {
      return await this.productsService.findAll();
    } catch (error) {
      this.logger.error(`Error fetching products: ${error.message}`);
      throw new RpcException(error.message);
    }
  }

  @MessagePattern('findOneProduct')
  async findOne(@Payload() id: number) {
    try {
      if (!id || id <= 0) {
        throw new BadRequestException('Invalid ID');
      }

      const product = await this.productsService.findOne(id);
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      return product;
    } catch (error) {
      this.logger.error(`Error fetching product with ID ${id}: ${error.message}`);
      throw new RpcException(error.message);
    }
  }

  @MessagePattern('updateProduct')
  async update(@Payload() data: { id: number; updateProductDto: UpdateProductDto }) {
    try {
      const { id, updateProductDto } = data;

      if (!id || id <= 0) {
        throw new BadRequestException('Invalid ID');
      }
      if (!updateProductDto) {
        throw new BadRequestException('No update data provided');
      }

      const updatedProduct = await this.productsService.update(id, updateProductDto);
      if (!updatedProduct) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      return updatedProduct;
    } catch (error) {
      this.logger.error(`Error updating product with ID ${data.id}: ${error.message}`);
      throw new RpcException(error.message);
    }
  }

  @MessagePattern('deleteProduct')
  async remove(@Payload() id: number): Promise<string> {
    try {
      if (!id || id <= 0) {
        throw new BadRequestException('Invalid ID');
      }

      await this.productsService.remove(id);
      return `Product with ID ${id} deleted successfully`;
    } catch (error) {
      this.logger.error(`Error deleting product with ID ${id}: ${error.message}`);
      throw new RpcException(error.message);
    }
  }

  @MessagePattern("validateProducts")
  validateProduct(@Payload() ids: number[]) {
    return this.productsService.validateProduct(ids);
  }
}
