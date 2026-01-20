import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  // 1. On ajoute ": any" ici
  create(@Request() req: any, @Body() createOrderDto: CreateOrderDto) {
    // 2. On force le type string ici
    return this.ordersService.create(req.user.userId as string, createOrderDto);
  }

  // Route pour voir MES commandes
  @UseGuards(AuthGuard('jwt'))
  @Get('my-orders')
  // 1. On ajoute ": any" ici
  findMyOrders(@Request() req: any) {
    // 2. On force le type string ici
    return this.ordersService.findMyOrders(req.user.userId as string);
  }

  // Route pour voir TOUTES les commandes (Idéalement AdminGuard ici)
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}
