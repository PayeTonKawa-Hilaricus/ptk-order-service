import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    // 1. Calcul du total
    const totalAmount = createOrderDto.items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    // 2. Création de la commande ET des lignes (Transactionnelle via Prisma)
    return this.prisma.order.create({
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
        items: true, // Pour renvoyer l'objet complet avec les items
      },
    });
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
