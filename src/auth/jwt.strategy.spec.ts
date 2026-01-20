import { JwtStrategy } from './jwt.strategy';
import { Test, TestingModule } from '@nestjs/testing';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('devrait être défini', () => {
    expect(strategy).toBeDefined();
  });

  it('validate() devrait renvoyer les infos utilisateur', () => {
    const payload = { sub: 'user-123', email: 'test@test.com', role: 'USER' };

    const result = strategy.validate(payload);

    expect(result).toEqual({
      userId: 'user-123',
      email: 'test@test.com',
      role: 'USER',
    });
  });
});
