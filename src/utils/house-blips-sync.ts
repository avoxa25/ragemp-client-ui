import { Character } from '../models/characters/character';
import { HouseService } from '../services/houses/house-service';
import { CharacterService } from '../services/characters/character-service';
import { BlipConstants } from '../constants/blip';
import { RemoteResponse } from '../constants/events/remote-response';

class HouseBlipsSync {
  private readonly blips: { [id: number]: BlipMp };
  private readonly character: Character;

  constructor() {
    this.blips = [];
    this.character = CharacterService.Get();

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
    HouseService.GetAll()
      .filter(h => h.ownerId !== undefined)
      .filter(h => h.onSale !== undefined)
      .filter(h => h.entrancePosition !== undefined)
      .forEach(h => {
        let color = BlipConstants.HouseOccupiedColor;
        color = h.onSale ? BlipConstants.HouseOnSaleColor : color;
        color = this.character.id === h.ownerId ? BlipConstants.HouseOwnedColor : color;

        let name = BlipConstants.HouseOccupiedName;
        name = h.onSale ? BlipConstants.HouseOnSaleName : name;
        name = this.character.id === h.ownerId ? BlipConstants.HouseOwnedName : name;

        const blip = mp.blips.new(
          BlipConstants.HouseSprite,
          h.entrancePosition as Vector3Mp,
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

        this.blips[h.id] = blip;
      });
  }

  private Sync(): void {
    HouseService.GetAll()
      .filter(h => h.ownerId !== undefined)
      .filter(h => h.onSale !== undefined)
      .filter(h => h.entrancePosition !== undefined)
      .forEach(h => {
        const color = this.GetColor(h.ownerId as number | null, h.onSale as boolean);
        this.blips[h.id].setColour(color);

        const name = this.GetName(h.ownerId as number | null, h.onSale as boolean);
        (this.blips[h.id] as any).name = name;
      });
  }

  private GetColor(ownerId: number | null, onSale: boolean): number {
    let color = BlipConstants.HouseOccupiedColor;
    color = onSale ? BlipConstants.HouseOnSaleColor : color;
    color = this.character.id === ownerId ? BlipConstants.HouseOwnedColor : color;

    return color;
  }

  private GetName(ownerId: number | null, onSale: boolean): string {
    let name = BlipConstants.HouseOccupiedName;
    name = onSale ? BlipConstants.HouseOnSaleName : name;
    name = this.character.id === ownerId ? BlipConstants.HouseOwnedName : name;

    return name;
  }
}

let houseBlipsSync: HouseBlipsSync | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => houseBlipsSync = houseBlipsSync ? houseBlipsSync : new HouseBlipsSync());