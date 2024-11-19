import { Controller,Body,Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';



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
  async findOne(@Body() id: number) {
    console.log('Received ID:', id); // Depura el ID recibido
    return this.productsService.findOne(id); // Asegúrate de que sea un número
  }

  @MessagePattern("updateProduct")
  update(@Body() data: { id: number, updateProductDto: UpdateProductDto }) {
    return this.productsService.update(data.id, data.updateProductDto);
  }

  @MessagePattern("deleteProduct")
  async remove(@Payload() id: number): Promise<string> {
    await this.productsService.remove(id);
    return `Product with ID ${id} deleted successfully`;
  }


 
  @MessagePattern("findByName")
  async search(@Query('name') name?: string) {
    return this.productsService.searchByName(name);
  }
}
