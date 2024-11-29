import { Controller, Logger, ParseIntPipe } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto, UpdateProductDto } from "./dto";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { PaginationDto } from "../common";

@Controller()
export class ProductsController {
  private readonly logger = new Logger("Error Log");
  constructor(private readonly productsService: ProductsService) {}
  
  @MessagePattern('createProduct')
  async create(@Payload() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  @MessagePattern('findAllProducts')
  async findAll(@Payload() paginationDto: PaginationDto) {
    return await this.productsService.findAll(paginationDto);
  }

  @MessagePattern('findOneProduct')
  async findOne(@Payload('id', ParseIntPipe) id: number) {
    return await this.productsService.findOne(id);
  }

  @MessagePattern('updateProduct')
  update(@Payload() payload: { id: number; updateProductDto: UpdateProductDto }) {
    const { id, updateProductDto } = payload;
    return this.productsService.update(id, updateProductDto);
  }

  @MessagePattern('deleteProduct')
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @MessagePattern("validateProducts")
  validateProduct(@Payload() ids: number[]) {
    return this.productsService.validateProduct(ids);
  }
}
