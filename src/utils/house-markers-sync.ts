import { interval } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { MarkerConstants } from '../constants/marker';
import { RemoteResponse } from '../constants/events/remote-response';
import { Character } from '../models/characters/character';
import { House } from '../models/houses/house';
import { GlobalCharacterProvider } from '../services/providers/character-provider';
import { GlobalHouseProvider } from '../services/providers/house-provider';

class HouseMarkersSync {
  private character: Character;
  private readonly entranceMarkers: { [id: number]: { marker: MarkerMp, ownerId: number | null, onSale: boolean, locked: boolean } };
  private readonly exitMarkers: { [id: number]: { marker: MarkerMp, ownerId: number | null, onSale: boolean, locked: boolean } };

  constructor() {
    this.character = undefined!;
    this.entranceMarkers = [];
    this.exitMarkers = [];

    GlobalCharacterProvider.GetCurrent().subscribe(c => this.character = c);

    this.StartSync();
  }

  private StartSync(): void {
    interval(1000)
      .pipe(
        switchMap(() => GlobalHouseProvider.GetAll()),
        mergeMap(h => h))
      .subscribe(h => this.Sync(h));
  }

  private Create(house: House): { entrance: MarkerMp, exit: MarkerMp } {
    let color = this.GetColor(house.ownerId as number | null, house.onSale as boolean);

    const entrancePosition = new mp.Vector3(house.entrancePosition.x, house.entrancePosition.y, house.entrancePosition.z);
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

    const exitPosition = new mp.Vector3(house.entrancePosition.x, house.entrancePosition.y, house.entrancePosition.z);
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

  private Sync(house: House): void {
    if (this.entranceMarkers[house.id] === undefined || this.exitMarkers[house.id] === undefined) {
      const markers = this.Create(house);

      this.entranceMarkers[house.id] = {
        marker: markers.entrance,
        ownerId: house.ownerId,
        onSale: house.onSale,
        locked: house.locked
      };

      this.exitMarkers[house.id] = {
        marker: markers.exit,
        ownerId: house.ownerId,
        onSale: house.onSale,
        locked: house.locked
      };

      return;
    }

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

    this.Create(house);
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