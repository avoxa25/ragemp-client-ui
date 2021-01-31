import { MarkerConstants } from '../Constants/marker.constants';
import { RemoteResponse } from '../Constants/remote-response';

class HouseMarkersSync {
  private readonly characterId: number;
  private readonly clientMarkers: { [id: number]: { marker: MarkerMp, ownerId: number | null, onSale: boolean, locked: boolean } };

  constructor() {
    this.characterId = mp.players.local.getVariable('Id') as number;

    this.clientMarkers = {};

    this.Initialize();
    setInterval(() => this.Sync(), 1000);
  }

  private Initialize(): void {
    this.GetServerMarkers().forEach(m => {
      const id = m.getVariable('Id') as number;
      const ownerId = m.getVariable('OwnerId') as number | null;
      const onSale = m.getVariable('OnSale') as boolean;
      const locked = m.getVariable('Locked') as boolean;

      let color = MarkerConstants.HouseOccupiedColor as RGBA;
      color = onSale ? MarkerConstants.HouseOnSaleColor as RGBA : color;
      color = this.characterId === ownerId ? MarkerConstants.HouseOwnedColor as RGBA : color;

      const clientMarker = mp.markers.new(
        MarkerConstants.HouseMarkerType,
        m.position,
        MarkerConstants.HouseScale,
        {
          bobUpAndDown: false,
          direction: MarkerConstants.HouseDirection,
          rotation: MarkerConstants.HouseRotation,
          color: color,
          visible: MarkerConstants.HouseVisible,
          dimension: m.dimension
        });

      this.clientMarkers[id] = { marker: clientMarker, ownerId: ownerId, onSale: onSale, locked: locked };
    });
  }

  private Sync(): void {
    this.GetServerMarkers().forEach(m => {
      const id = m.getVariable('Id') as number;
      const ownerId = m.getVariable('OwnerId') as number | null;
      const onSale = m.getVariable('OnSale') as boolean;
      const locked = m.getVariable('Locked') as boolean;

      let color = MarkerConstants.HouseOccupiedColor as RGBA;
      color = onSale ? MarkerConstants.HouseOnSaleColor as RGBA : color;
      color = this.characterId === ownerId ? MarkerConstants.HouseOwnedColor as RGBA : color;

      const clientMarker = this.clientMarkers[id];
      const isOwnerChanged = clientMarker.ownerId !== ownerId;
      const isOnSaleChanged = clientMarker.onSale !== onSale;
      const isLockedChanged = clientMarker.locked !== locked;
      if (isOwnerChanged || isOnSaleChanged || isLockedChanged) {
        mp.markers.new(
          MarkerConstants.HouseMarkerType,
          m.position,
          MarkerConstants.HouseScale,
          {
            bobUpAndDown: false,
            direction: MarkerConstants.HouseDirection,
            rotation: MarkerConstants.HouseRotation,
            color: color,
            visible: MarkerConstants.HouseVisible,
            dimension: m.dimension
          });
      }
    });
  }

  private GetServerMarkers(): MarkerMp[] {
    return mp.markers
      .toArray()
      .filter(m => (m as any).hasVariable('Exists') && m.getVariable('Exists') === false)
      .filter(m => (m as any).hasVariable('Type') && m.getVariable('Type') === 'House');
  }
}

let houseMarkersSync: HouseMarkersSync | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => houseMarkersSync = houseMarkersSync ? houseMarkersSync : new HouseMarkersSync());