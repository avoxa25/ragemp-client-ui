import { interval } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';
import { GlobalBlipProvider } from '../services/providers/blip-provider';
import { GlobalHouseProvider } from '../services/providers/house-provider';
import { GlobalCharacterProvider } from '../services/providers/character-provider';
import { BlipConstants } from '../constants/blip';
import { RemoteResponse } from '../constants/events/remote-response';
import { Character } from '../models/characters/character';
import { House } from '../models/houses/house';

class HouseBlipsSync {
  private character: Character;
  private readonly blips: { [id: number]: BlipMp };

  constructor() {
    this.character = undefined!;
    this.blips = [];

    GlobalCharacterProvider.GetCurrent().subscribe(c => this.character = c);

    this.HideServerBlips();
    this.StartSync();
  }

  private HideServerBlips(): void {
    GlobalBlipProvider.GetServerHouses()
      .pipe(mergeMap(b => b))
      .subscribe(b => b.setDisplay(0));
  }

  private StartSync(): void {
    interval(1000)
      .pipe(
        switchMap(() => GlobalHouseProvider.GetAll()),
        mergeMap(h => h))
      .subscribe(h => this.Sync(h));
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

  private Create(house: House, color: number, name: string): BlipMp {
    return mp.blips.new(
      BlipConstants.HouseSprite,
      house.entrancePosition as Vector3Mp,
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
  }

  private Sync(house: House): void {
    const color = this.GetColor(house.ownerId as number | null, house.onSale as boolean);
    const name = this.GetName(house.ownerId as number | null, house.onSale as boolean);

    if (this.blips[house.id] === undefined) {
      const blip = this.Create(house, color, name);
      this.blips[house.id] = blip;
    } else {
      if (this.blips[house.id].getColour() !== color) this.blips[house.id].setColour(color);
      if ((this.blips[house.id] as any).name !== name) (this.blips[house.id] as any).name = name;
    }
  }
}

let houseBlipsSync: HouseBlipsSync | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => houseBlipsSync = houseBlipsSync ? houseBlipsSync : new HouseBlipsSync());