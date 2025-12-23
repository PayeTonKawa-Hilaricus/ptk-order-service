import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from '../prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    // Configuration du client RabbitMQ
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE', // Nom qu'on utilisera pour l'injection
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
          ],
          queue: 'orders_queue', // Nom de la file d'attente
          queueOptions: {
            durable: true, // La file d'attente persiste même si RabbitMQ redémarre
          },
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService],
})
export class OrdersModule {}
