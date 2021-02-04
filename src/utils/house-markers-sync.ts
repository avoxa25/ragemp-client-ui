import { interval } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { HouseProvider } from '../services/providers/house-provider';
import { CharacterProvider } from '../services/providers/character-provider';
import { MarkerConstants } from '../constants/marker';
import { RemoteResponse } from '../constants/events/remote-response';
import { Character } from '../models/characters/character';
import { House } from '../models/houses/house';

class HouseMarkersSync {
  private readonly houseProvider: HouseProvider;
  private readonly characterProvider: CharacterProvider;

  private character: Character;
  private readonly entranceMarkers: { [id: number]: { marker: MarkerMp, ownerId: number | null, onSale: boolean, locked: boolean } };
  private readonly exitMarkers: { [id: number]: { marker: MarkerMp, ownerId: number | null, onSale: boolean, locked: boolean } };

  constructor() {
    this.houseProvider = new HouseProvider();
    this.characterProvider = new CharacterProvider();

    this.character = undefined!;
    this.entranceMarkers = [];
    this.exitMarkers = [];

    this.characterProvider.Get().subscribe(c => this.character = c);

    this.CreateClientMarkers();
    this.StartSync();
  }

  private CreateClientMarkers(): void {
    this.houseProvider.GetAll()
      .pipe(
        mergeMap(h => h),
        map(h => ({ house: h, markers: this.CreateHouseMarkers(h) })))
      .subscribe(t => {
        this.entranceMarkers[t.house.id] = {
          marker: t.markers.entrance,
          ownerId: t.house.ownerId,
          onSale: t.house.onSale,
          locked: t.house.locked
        };
        this.exitMarkers[t.house.id] = {
          marker: t.markers.exit,
          ownerId: t.house.ownerId,
          onSale: t.house.onSale,
          locked: t.house.locked
        };
      });
  }

  private StartSync(): void {
    interval(1000)
      .pipe(
        switchMap(() => this.houseProvider.GetAll()),
        mergeMap(h => h))
      .subscribe(h => this.SyncHouseMarkers(h));
  }

  private CreateHouseMarkers(house: House): { entrance: MarkerMp, exit: MarkerMp } {
    let color = this.GetColor(house.ownerId as number | null, house.onSale as boolean);

    const entrancePosition = new mp.Vector3(house.entrancePosition?.x, house.entrancePosition?.y, house.entrancePosition?.z);
    entrancePosition.z -= 1.5;

    const entranceMarker = mp.markers.new(
      MarkerConstants.HouseMarkerType,
      entrancePosition,
      MarkerConstants.HouseScale,
      {
        bobUpAndDown: false,
        direction: MarkerConstants.HouseDirection,
        rotation: MarkerConstants.HouseRotation,
        color: color,
        visible: MarkerConstants.HouseVisible,
        dimension: 0
      });

    const exitPosition = new mp.Vector3(house.entrancePosition?.x, house.entrancePosition?.y, house.entrancePosition?.z);
    exitPosition.z -= 1.5;

    const exitMarker = mp.markers.new(
      MarkerConstants.HouseMarkerType,
      exitPosition,
      MarkerConstants.HouseScale,
      {
        bobUpAndDown: false,
        direction: MarkerConstants.HouseDirection,
        rotation: MarkerConstants.HouseRotation,
        color: color,
        visible: MarkerConstants.HouseVisible,
        dimension: house.id
      });

    return { entrance: entranceMarker, exit: exitMarker };
  }

  private SyncHouseMarkers(house: House): void {
    const ownerChanged =
      house.ownerId !== this.entranceMarkers[house.id].ownerId ||
      house.ownerId !== this.exitMarkers[house.id].ownerId;

    const onSaleChanged =
      house.onSale !== this.entranceMarkers[house.id].onSale ||
      house.onSale !== this.exitMarkers[house.id].onSale;

    const lockedChanged =
      house.locked !== this.entranceMarkers[house.id].locked ||
      house.locked !== this.exitMarkers[house.id].locked;

    if (!ownerChanged && !onSaleChanged && !lockedChanged) return;

    // TODO: Find a better way to destroy/hide markers
    // marker.setVisible is not a function
    // marker.destroy is not a function
    // marker.setCoords is not a function
    // marker.setCoords2 is not a function
    // marker.getPedIndexFromIndex is not a function
    // Cannot assign to read only property 'dimension'

    this.CreateHouseMarkers(house);
  }

  private GetColor(ownerId: number | null, onSale: boolean): RGBA {
    let color = MarkerConstants.HouseOccupiedColor;
    color = onSale ? MarkerConstants.HouseOnSaleColor : color;
    color = this.character.id === ownerId ? MarkerConstants.HouseOwnedColor : color;

    return color;
  }
}

let houseMarkersSync: HouseMarkersSync | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => houseMarkersSync = houseMarkersSync ? houseMarkersSync : new HouseMarkersSync());