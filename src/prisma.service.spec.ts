import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();
    service = module.get<PrismaService>(PrismaService);
  });

  it('devrait être défini', () => {
    expect(service).toBeDefined();
  });

  it("devrait se connecter à l'init", async () => {
    const connectSpy = jest
      .spyOn(service, '$connect')
      .mockImplementation(async () => {});
    await service.onModuleInit();
    expect(connectSpy).toHaveBeenCalled();
  });

  it('devrait se déconnecter à la destruction', async () => {
    const disconnectSpy = jest
      .spyOn(service, '$disconnect')
      .mockImplementation(async () => {});
    await service.onModuleDestroy();
    expect(disconnectSpy).toHaveBeenCalled();
  });
});
