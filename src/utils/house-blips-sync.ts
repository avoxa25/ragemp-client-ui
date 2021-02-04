import { interval } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { BlipProvider } from '../services/providers/blip-provider';
import { HouseProvider } from '../services/providers/house-provider';
import { CharacterProvider } from '../services/providers/character-provider';
import { BlipConstants } from '../constants/blip';
import { RemoteResponse } from '../constants/events/remote-response';
import { Character } from '../models/characters/character';

class HouseBlipsSync {
  private readonly blipProvider: BlipProvider;
  private readonly houseProvider: HouseProvider;
  private readonly characterProvider: CharacterProvider;

  private character: Character;
  private readonly blips: { [id: number]: BlipMp };  

  constructor() {
    this.blipProvider = new BlipProvider();
    this.houseProvider = new HouseProvider();
    this.characterProvider = new CharacterProvider();

    this.character = undefined!;
    this.blips = [];    

    this.characterProvider.Get().subscribe(c => this.character = c);

    this.HideServerBlips();
    this.CreateClientBlips();
    this.StartSync();
  }

  private HideServerBlips(): void {
    this.blipProvider.GetServerHouses()
      .pipe(mergeMap(b => b))
      .subscribe(b => b.setDisplay(0));
  }

  private CreateClientBlips(): void {
    this.houseProvider.GetAll()
      .pipe(
        mergeMap(h => h),
        map(h => {
          const color = this.GetColor(h.ownerId, h.onSale);
          const name = this.GetName(h.ownerId, h.onSale);

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

          return ({ house: h, blip: blip });
        }))
      .subscribe(t => this.blips[t.house.id] = t.blip);
  }

  private StartSync(): void {
    interval(1000)
      .pipe(
        switchMap(() => this.houseProvider.GetAll()),
        mergeMap(h => h))
      .subscribe(h => {
        const color = this.GetColor(h.ownerId as number | null, h.onSale as boolean);
        if (this.blips[h.id].getColour() !== color) this.blips[h.id].setColour(color);

        const name = this.GetName(h.ownerId as number | null, h.onSale as boolean);
        if ((this.blips[h.id] as any).name !== name) (this.blips[h.id] as any).name = name;
      })
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