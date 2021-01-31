import { MarkerConstants } from '../constants/marker';
import { Character } from '../models/characters/character';
import { CharacterService } from '../services/characters/character-service';
import { HouseService } from '../services/houses/house-service';
import { House } from '../models/houses/house';
import { RemoteResponse } from '../constants/events/remote-response';

class HouseMarkersSync {
  private readonly entranceMarkers: { [id: number]: { marker: MarkerMp, ownerId: number | null, onSale: boolean, locked: boolean } };
  private readonly exitMarkers: { [id: number]: { marker: MarkerMp, ownerId: number | null, onSale: boolean, locked: boolean } };

  private readonly character: Character;

  constructor() {
    this.entranceMarkers = {};
    this.exitMarkers = {};

    this.character = CharacterService.Get();

    this.CreateClientMarkers();
    setInterval(() => this.Sync(), 1000);
  }

  private CreateClientMarkers(): void {
    HouseService.GetAll()
      .filter(h => h.ownerId !== undefined)
      .filter(h => h.onSale !== undefined)
      .filter(h => h.locked !== undefined)
      .filter(h => h.entrancePosition !== undefined)
      .filter(h => h.exitPosition !== undefined)
      .forEach(h => this.CreateHouseMarkers(h));
  }

  private Sync(): void {
    HouseService.GetAll()
      .filter(h => h.ownerId !== undefined)
      .filter(h => h.onSale !== undefined)
      .filter(h => h.locked !== undefined)
      .filter(h => h.entrancePosition !== undefined)
      .filter(h => h.exitPosition !== undefined)
      .forEach(h => this.SyncHouseMarkers(h));
  }

  private CreateHouseMarkers(house: House): void {
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

    this.entranceMarkers[house.id] = {
      marker: entranceMarker,
      ownerId: house.ownerId as number | null,
      onSale: house.onSale as boolean,
      locked: house.locked as boolean
    };

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

    this.exitMarkers[house.id] = {
      marker: exitMarker,
      ownerId: house.ownerId as number | null,
      onSale: house.onSale as boolean,
      locked: house.locked as boolean
    };
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