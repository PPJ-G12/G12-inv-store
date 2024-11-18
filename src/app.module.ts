import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/entities/product.entity';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ProductsModule,
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables de configuración estén disponibles globalmente
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: 'store-db', // 'store-db',
        port: 5432,
        username: 'postgres',
        password: '123456',
        database: 'storedb',
        entities: [Product],
        autoLoadEntities: true, // Carga automáticamente las entidades
        synchronize: true, // ¡Solo para desarrollo!
      }),
    }),
  ],
  controllers: [],
  
})
export class AppModule {}
