import { HouseType } from './house-type.enum';

export class House {
  public id: number;
  public ownerId: number | null | undefined;

  public name: string | undefined;
  public type: HouseType | undefined;
  public garageCapacity: number | undefined;
  public locked: boolean | undefined;

  public onSale: boolean | undefined;
  public originalPrice: number | undefined;
  public onSalePrice: number | undefined;

  public entrancePosition: Vector3Mp | undefined;
  public exitPosition: Vector3Mp | undefined;

  constructor(id: number) {
    this.id = id;
    this.ownerId = null;
  }
}