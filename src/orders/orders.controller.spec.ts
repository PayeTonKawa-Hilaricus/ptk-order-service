import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  // On simule le service (pas besoin de la vraie logique ni de RabbitMQ ici)
  const mockOrdersService = {
    create: jest
      .fn()
      .mockResolvedValue({ id: '1', total: 20, status: 'PENDING' }),
    findMyOrders: jest.fn().mockResolvedValue([{ id: '1', total: 20 }]),
    findAll: jest.fn().mockResolvedValue([{ id: '1', total: 20 }]),
    findOne: jest.fn().mockResolvedValue({ id: '1', total: 20 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: mockOrdersService }],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('devrait être défini', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('devrait appeler le service.create avec le bon userId', async () => {
      const dto = new CreateOrderDto();
      // Simulation de la requête avec l'utilisateur injecté par le Guard JWT
      const req = { user: { userId: 'user-123' } };

      await controller.create(req, dto);

      expect(service.create).toHaveBeenCalledWith('user-123', dto);
    });
  });

  describe('findMyOrders', () => {
    it('devrait appeler service.findMyOrders', async () => {
      const req = { user: { userId: 'user-123' } };
      await controller.findMyOrders(req);
      expect(service.findMyOrders).toHaveBeenCalledWith('user-123');
    });
  });

  describe('findAll', () => {
    it('devrait appeler service.findAll', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('devrait appeler service.findOne avec le bon ID', async () => {
      await controller.findOne('order-id-1');
      expect(service.findOne).toHaveBeenCalledWith('order-id-1');
    });
  });
});
