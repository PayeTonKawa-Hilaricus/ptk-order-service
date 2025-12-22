import { Injectable, Inject } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from '../prisma.service';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    // On injecte le client RabbitMQ défini dans le module
    @Inject('PRODUCT_SERVICE') private readonly productClient: ClientProxy,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    // 1. Calcul du total
    const totalAmount = createOrderDto.items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    // 2. Création en BDD
    const newOrder = await this.prisma.order.create({
      data: {
        userId: userId,
        total: totalAmount,
        status: 'PENDING',
        items: {
          create: createOrderDto.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // 3. RABBITMQ : On crie dans le tuyau "Une commande a été créée !"
    // Pattern: 'order_created' | Payload: la commande entière
    this.productClient.emit('order_created', newOrder);

    return newOrder;
  }

  // Voir toutes les commandes (Pour ADMIN)
  findAll() {
    return this.prisma.order.findMany({
      include: { items: true },
    });
  }

  // Voir MES commandes (Pour CLIENT)
  findMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
    });
  }

  findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
  }
}
