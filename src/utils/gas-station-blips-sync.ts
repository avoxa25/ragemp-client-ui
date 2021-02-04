import { interval } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { Character } from '../models/characters/character';
import { BlipProvider } from '../services/providers/blip-provider';
import { CharacterProvider } from '../services/providers/character-provider';
import { GasStationProvider } from '../services/providers/gas-station-provider';
import { BlipConstants } from '../constants/blip';
import { RemoteResponse } from '../constants/events/remote-response';
import { GasStation } from '../models/gas-station';

class GasStationBlipsSync {
  private readonly blipProvider: BlipProvider;
  private readonly gasStationProvider: GasStationProvider;
  private readonly characterProvider: CharacterProvider;

  private character: Character;
  private readonly blips: { [id: number]: BlipMp };

  constructor() {
    this.blipProvider = new BlipProvider();
    this.gasStationProvider = new GasStationProvider();
    this.characterProvider = new CharacterProvider();

    this.character = undefined!;
    this.blips = [];

    this.characterProvider.Get().subscribe(c => this.character = c);

    this.HideServerBlips();
    this.CreateClientBlips();
    this.StartSync();
  }

  private HideServerBlips(): void {
    this.blipProvider.GetServerGasStations()
      .pipe(mergeMap(b => b))
      .subscribe(b => b.setDisplay(0));
  }

  private CreateClientBlips(): void {
    this.gasStationProvider.GetAll()
      .pipe(
        mergeMap(gs => gs),
        map(gs => {
          const color = this.GetColor(gs);
          const name = this.GetName(gs);

          const blip = mp.blips.new(
            BlipConstants.GasStationSprite,
            gs.position,
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

          return ({ blip: blip, gasStation: gs });
        }))
      .subscribe(t => this.blips[t.gasStation.id] = t.blip);
  }

  private StartSync(): void {
    interval(1000)
      .pipe(
        switchMap(() => this.gasStationProvider.GetAll()),
        mergeMap(gs => gs))
      .subscribe(gs => {
        const color = this.GetColor(gs);
        if (this.blips[gs.id].getColour() !== color) this.blips[gs.id].setColour(color);

        const name = this.GetName(gs);
        if ((this.blips[gs.id] as any).name !== name) (this.blips[gs.id] as any).name = name;
      });
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
}

let gasStationBlipsSync: GasStationBlipsSync | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => gasStationBlipsSync = gasStationBlipsSync ? gasStationBlipsSync : new GasStationBlipsSync());