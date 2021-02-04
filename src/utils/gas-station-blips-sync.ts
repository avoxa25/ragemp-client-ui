import { interval } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';
import { Character } from '../models/characters/character';
import { GlobalBlipProvider } from '../services/providers/blip-provider';
import { GlobalCharacterProvider } from '../services/providers/character-provider';
import { GlobalGasStationProvider } from '../services/providers/gas-station-provider';
import { BlipConstants } from '../constants/blip';
import { RemoteResponse } from '../constants/events/remote-response';
import { GasStation } from '../models/gas-station';

class GasStationBlipsSync {
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
    GlobalBlipProvider.GetServerGasStations()
      .pipe(mergeMap(b => b))
      .subscribe(b => b.setDisplay(0));
  }

  private StartSync(): void {
    interval(1000)
      .pipe(
        switchMap(() => GlobalGasStationProvider.GetAll()),
        mergeMap(gs => gs))
      .subscribe(gs => this.Sync(gs));
  }

  private GetColor(gasStation: GasStation): number {
    let color = BlipConstants.GasStationOccupiedColor;
    color = gasStation.onSale ? BlipConstants.GasStationOnSaleColor : color;
    color = this.character.id === gasStation.ownerId ? BlipConstants.GasStationOwnedColor : color;

    return color;
  }

  private GetName(gasStation: GasStation): string {
    let name = BlipConstants.GasStationOccupiedName;
    name = gasStation.onSale ? BlipConstants.GasStationOnSaleName : name;
    name = this.character.id === gasStation.ownerId ? BlipConstants.GasStationOwnedName : name;

    return name;
  }

  private Create(gasStation: GasStation, color: number, name: string): BlipMp {
    return mp.blips.new(
      BlipConstants.GasStationSprite,
      gasStation.position,
      {
        alpha: BlipConstants.GasStationAlpha,
        color: color,
        dimension: BlipConstants.GasStationDimension,
        drawDistance: BlipConstants.GasStationDrawDistance,
        name: name,
        rotation: BlipConstants.GasStationRotation,
        scale: BlipConstants.GasStationScale,
        shortRange: BlipConstants.GasStationShortRange
      });
  }

  private Sync(gasStation: GasStation): void {
    const color = this.GetColor(gasStation);
    const name = this.GetName(gasStation);

    if (this.blips[gasStation.id] === undefined) {
      const blip = this.Create(gasStation, color, name);
      this.blips[gasStation.id] = blip;
    } else {
      if (this.blips[gasStation.id].getColour() !== color) this.blips[gasStation.id].setColour(color);
      if ((this.blips[gasStation.id] as any).name !== name) (this.blips[gasStation.id] as any).name = name;
    }
  }
}

let gasStationBlipsSync: GasStationBlipsSync | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => gasStationBlipsSync = gasStationBlipsSync ? gasStationBlipsSync : new GasStationBlipsSync());