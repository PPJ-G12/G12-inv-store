import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/entities/product.entity';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ProductsModule,
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: 'store-db', 
        username: 'postgres',
        password: '123456',
        database: 'storedb',
        entities: [Product],
        autoLoadEntities: true, 
        synchronize: true, 
      }),
    }),
  ],
  controllers: [],
  
})
export class AppModule {}
