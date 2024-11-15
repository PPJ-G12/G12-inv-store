import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a product', () => {
    const product = service.create({
      name: 'Test Product',
      description: 'Description',
      price: 100,
      stock: 10,
      category: 'Test',
    });
    expect(product).toHaveProperty('id');
  });
});
