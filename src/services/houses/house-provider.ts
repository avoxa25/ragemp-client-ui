import { HouseType } from '../../models/houses/house-type';
import { House } from '../../models/houses/house';

export abstract class HouseProvider {
  public static GetAllFromBlips(): House[] {
    return mp.blips
      .toArray()
      .filter(b => b.hasVariable('DummyEntity') && b.getVariable('DummyEntity') === 'House')
      .map(b => {
        const id = b.getVariable('Id') as number;
        const house = new House(id);

        const ownerId = b.getVariable('OwnerId') as number | null;
        house.ownerId = ownerId;

        const onSale = b.getVariable('OnSale') as boolean;
        house.onSale = onSale;

        const entrancePosition = b.getCoords();
        house.entrancePosition = entrancePosition;

        return house;
      });
  }

  public static UpdateFromBlip(house: House): void {
    mp.blips
      .toArray()
      .filter(b => b.hasVariable('DummyEntity') && b.getVariable('DummyEntity') === 'House')
      .filter(b => b.getVariable('Id') === house.id)
      .forEach(b => {
        const ownerId = b.getVariable('OwnerId') as number | null;
        house.ownerId = ownerId;

        const onSale = b.getVariable('OnSale') as boolean;
        house.onSale = onSale;

        const entrancePosition = b.getCoords();
        house.entrancePosition = entrancePosition;
      });
  }

  public static UpdateFromMarkers(house: House): void {
    mp.markers
      .toArray()
      .filter(m => m.dimension !== 0)
      .filter(m => (m as any).hasVariable('DummyEntity') && m.getVariable('DummyEntity') === 'House')
      .filter(m => m.getVariable('Id') === house.id)
      .forEach(m => house.exitPosition = m.position);
  }

  public static UpdateFromColShape(house: House): void {
    mp.colshapes
      .toArray()
      .filter(cs => cs.dimension !== 0)
      .filter(cs => (cs as any).hasVariable('DummyEntity') && cs.getVariable('DummyEntity') === 'House')
      .filter(cs => cs.getVariable('Id') === house.id)
      .forEach(cs => {
        const type = cs.getVariable('Type') as HouseType;
        house.type = type;

        const garageCapacity = cs.getVariable('GarageCapacity') as number;
        house.garageCapacity = garageCapacity;

        const originalPrice = cs.getVariable('OriginalPrice') as number;
        house.originalPrice = originalPrice;

        const onSalePrice = cs.getVariable('OnSalePrice') as number;
        house.onSalePrice = onSalePrice;
      });
  }
}