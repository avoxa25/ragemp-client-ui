import { HouseType } from './house-type';

export interface House {
  id: number;
  ownerId: number | null;

  name: string;
  type: HouseType;
  garageCapacity: number;
  locked: boolean;

  onSale: boolean;
  originalPrice: number;
  onSalePrice: number;

  entrancePosition: Vector3Mp;
  exitPosition: Vector3Mp;
}