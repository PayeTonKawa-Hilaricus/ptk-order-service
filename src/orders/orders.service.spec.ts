import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma.service';
import { ClientProxy } from '@nestjs/microservices';

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: PrismaService;
  let rabbitClient: ClientProxy;

  // Simulation Prisma complète (Create + Find)
  const mockPrismaService = {
    order: {
      create: jest.fn().mockImplementation((dto) =>
        Promise.resolve({
          id: 'uuid-test-123',
          ...dto.data,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ),
      findMany: jest
        .fn()
        .mockResolvedValue([{ id: 'order-1' }, { id: 'order-2' }]),
      findUnique: jest.fn().mockResolvedValue({ id: 'order-1' }),
    },
  };

  const mockRabbitClient = {
    emit: jest.fn().mockReturnValue({ subscribe: () => {} }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: 'PRODUCT_SERVICE', useValue: mockRabbitClient },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prisma = module.get<PrismaService>(PrismaService);
    rabbitClient = module.get<ClientProxy>('PRODUCT_SERVICE');
  });

  it('devrait être défini', () => {
    expect(service).toBeDefined();
  });

  // --- Test CREATE ---
  describe('create()', () => {
    it('devrait créer une commande', async () => {
      const result = await service.create('user-123', {
        items: [{ productId: 'p1', quantity: 1, price: 10 }],
      });
      expect(result.total).toEqual(10);
      expect(prisma.order.create).toHaveBeenCalled();
      expect(rabbitClient.emit).toHaveBeenCalledWith(
        'order_created',
        expect.anything(),
      );
    });
  });

  // --- Test FIND ---
  describe('findAll()', () => {
    it('devrait retourner toutes les commandes', async () => {
      const result = await service.findAll();
      expect(result).toHaveLength(2);
      expect(prisma.order.findMany).toHaveBeenCalled();
    });
  });

  describe('findMyOrders()', () => {
    it("devrait retourner les commandes de l'utilisateur", async () => {
      await service.findMyOrders('user-123');
      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 'user-123' } }),
      );
    });
  });

  describe('findOne()', () => {
    it('devrait retourner une commande unique', async () => {
      await service.findOne('order-1');
      expect(prisma.order.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'order-1' } }),
      );
    });
  });
});
