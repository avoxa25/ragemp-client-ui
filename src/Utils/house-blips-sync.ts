import { Character } from '../models/view-models/characters/character.model';
import { HouseService } from '../services/houses/house-service';
import { CharacterService } from '../services/characters/character-service';
import { BlipConstants } from '../constants/blip.constants';
import { RemoteResponse } from '../models/enums/events/remote-response.enum';

class HouseBlipsSync {
  private readonly blips: { [id: number]: BlipMp };
  private readonly player: Character;

  constructor() {
    this.blips = [];
    this.player = CharacterService.Get();

    this.HideServerBlips();
    this.CreateClientBlips();
    
    setInterval(() => this.Sync(), 1000);
  }

  private HideServerBlips(): void {
    mp.blips
      .toArray()
      .filter(b => b.hasVariable('DummyEntity') && b.getVariable('DummyEntity') === 'House')
      .forEach(b => b.setDisplay(0));
  }

  private CreateClientBlips(): void {
    const houses = HouseService.getAll();
    for (let i = 0; i < houses.length; i++) {
      const house = houses[i];
      if (house.ownerId === undefined ||
        house.onSale === undefined ||
        house.entrancePosition === undefined) {
        mp.console.logError('Invalid house was provided');
        continue;
      }

      let color = BlipConstants.HouseOccupiedColor;
      color = house.onSale ? BlipConstants.HouseOnSaleColor : color;
      color = this.player.id === house.ownerId ? BlipConstants.HouseOwnedColor : color;

      let name = BlipConstants.HouseOccupiedName;
      name = house.onSale ? BlipConstants.HouseOnSaleName : name;
      name = this.player.id === house.ownerId ? BlipConstants.HouseOwnedName : name;

      const blip = mp.blips.new(
        BlipConstants.HouseSprite,
        house.entrancePosition,
        {
          alpha: BlipConstants.HouseAlpha,
          color: color,
          dimension: BlipConstants.HouseDimension,
          drawDistance: BlipConstants.HouseDrawDistance,
          name: name,
          rotation: BlipConstants.HouseRotation,
          scale: BlipConstants.HouseScale,
          shortRange: BlipConstants.HouseShortRange
        });

      this.blips[house.id] = blip;
    }
  }

  private Sync(): void {
    const houses = HouseService.getAll();
    for (let i = 0; i < houses.length; i++) {
      const house = houses[i];
      if (house.ownerId === undefined || house.onSale === undefined) {
        mp.console.logError('Invalid house was provided');
        continue;
      }

      const color = this.GetColor(house.ownerId, house.onSale);
      this.blips[house.id].setColour(color);

      const name = this.GetName(house.ownerId, house.onSale);
      (this.blips[house.id] as any).name = name;
    }
  }

  private GetColor(ownerId: number | null, onSale: boolean): number {
    let color = BlipConstants.HouseOccupiedColor;
    color = onSale ? BlipConstants.HouseOnSaleColor : color;
    color = this.player.id === ownerId ? BlipConstants.HouseOwnedColor : color;

    return color;
  }

  private GetName(ownerId: number | null, onSale: boolean): string {
    let name = BlipConstants.HouseOccupiedName;
    name = onSale ? BlipConstants.HouseOnSaleName : name;
    name = this.player.id === ownerId ? BlipConstants.HouseOwnedName : name;

    return name;
  }
}

let houseBlipsSync: HouseBlipsSync | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => houseBlipsSync = houseBlipsSync ? houseBlipsSync : new HouseBlipsSync());