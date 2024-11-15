import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
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
        host: 'localhost',
        port: 5432,
        username: 'nest_user',
        password: 'nest_password',
        database: 'products_db',
        entities: [Product],
        autoLoadEntities: true, // Carga automáticamente las entidades
        synchronize: true, // ¡Solo para desarrollo!
      }),
    }),
  ],
  controllers: [AppController],
  
})
export class AppModule {}
