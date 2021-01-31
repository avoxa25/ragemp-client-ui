import { House } from '../../models/view-models/houses/house';

export abstract class HouseProvider {
  public static getAllFromBlips(): House[] {
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

  public static updateFromBlip(house: House): void {
    const blip = mp.blips
      .toArray()
      .filter(b => b.hasVariable('DummyEntity') && b.getVariable('DummyEntity') === 'House')
      .find(b => b.getVariable('Id') === house.id);

    if (!blip) {
      mp.console.logError('No blip found for provided house');
      return;
    };

    const ownerId = blip.getVariable('OwnerId') as number | null;
    house.ownerId = ownerId;

    const onSale = blip.getVariable('OnSale') as boolean;
    house.onSale = onSale;

    const entrancePosition = blip.getCoords();
    house.entrancePosition = entrancePosition;
  }
}