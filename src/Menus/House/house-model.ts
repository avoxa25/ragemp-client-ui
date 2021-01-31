export class HouseModel {
  public id: number;

  public ownerId: number | null;
  public ownerName: string | null;

  public name: string;
  public type: string;

  public garageCapacity: number;

  public locked: boolean;
  public onSale: boolean;

  public originalPrice: number;
  public onSalePrice: number;

  constructor() {
    this.id = 0;
    this.ownerId = 0;
    this.ownerName = '';
    this.name = '';
    this.type = '';
    this.garageCapacity = 0;
    this.locked = false;
    this.onSale = false;
    this.originalPrice = 0;
    this.onSalePrice = 0;
  }
}