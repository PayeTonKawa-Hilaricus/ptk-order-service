import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [OrdersModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStrategy],
})
export class AppModule {}
