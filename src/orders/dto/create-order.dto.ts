import { IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

// DTO pour un article unique dans le panier
class OrderItemDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number; // On envoie le prix unitaire ici pour simplifier (idéalement récupéré du service produit)
}

// DTO pour la commande globale
export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true }) // Valide chaque élément du tableau
  @Type(() => OrderItemDto)       // Transforme le JSON en objets OrderItemDto
  items: OrderItemDto[];
}