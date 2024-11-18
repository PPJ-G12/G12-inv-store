import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  
  @MessagePattern("createProduct")
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @MessagePattern("findAllProducts")
  findAll() {
    return this.productsService.findAll();
  }

  @MessagePattern("findOneProduct")
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @MessagePattern("updateProduct")
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @MessagePattern("deleteProduct")
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

 
  @MessagePattern("findByName")
  async search(@Query('name') name?: string) {
    return this.productsService.searchByName(name);
  }
}
