import { BlipConstants } from '../Constants/blip.constants';
import { RemoteResponse } from '../Constants/remote-response';

class HouseMarkersSync {
  private readonly characterId: number;
  private readonly clientBlips: { [id: number]: BlipMp };

  constructor() {
    const rawId = mp.players.local.getVariable('Id') as string;
    this.characterId = Number.parseInt(rawId);

    this.clientBlips = {};

    this.Initialize();
    setInterval(() => this.Sync(), 1000);
  }

  private Initialize(): void {
    this.GetServerMarkers().forEach(m => {
      const id = m.getVariable('Id') as number;
      const ownerId = m.getVariable('OwnerId') as number | null;
      const onSale = m.getVariable('OnSale') as boolean;

      const position = m.getCoords(true);

      let color = BlipConstants.HouseOccupiedColor;
      color = onSale ? BlipConstants.HouseOnSaleColor : color;
      color = this.characterId === ownerId ? BlipConstants.HouseOwnedColor : color;

      let name = BlipConstants.HouseOccupiedName;
      name = onSale ? BlipConstants.HouseOnSaleName : name;
      name = this.characterId === ownerId ? BlipConstants.HouseOwnedName : name;

      const clientBlip = mp.markers.new(0, position, 0, {
        bobUpAndDown: false,
        color: 0,
        dimension: 0,
        direction: 0,
        rotation: 0
      });

      this.clientBlips[id] = clientBlip;
    });
  }

  private Sync(): void {
    this.GetServerMarkers().forEach(b => {
      const id = b.getVariable('Id') as number;
      const ownerId = b.getVariable('OwnerId') as number | null;
      const onSale = b.getVariable('OnSale') as boolean;

      let color = BlipConstants.HouseOccupiedColor;
      color = onSale ? BlipConstants.HouseOnSaleColor : color;
      color = this.characterId === ownerId ? BlipConstants.HouseOwnedColor : color;

      let name = BlipConstants.HouseOccupiedName;
      name = onSale ? BlipConstants.HouseOnSaleName : name;
      name = this.characterId === ownerId ? BlipConstants.HouseOwnedName : name;

      const clientBlip = this.clientBlips[id];
      clientBlip.setColour(color);
      (clientBlip as any).name = name;
    });
  }

  private GetServerMarkers(): MarkerMp[] {
    return mp.markers
      .toArray()
      .filter(m => m.dimension === 4294967295)
      .filter(m => (m as any).hasVariable('Exists') && m.getVariable('Exists') === false)
      .filter(m => (m as any).hasVariable('Type') && m.getVariable('Type') === 'House');
  }
};

let houseMarkersSync: HouseMarkersSync | undefined;
mp.events.add(RemoteResponse.CharacterSelected, () => houseMarkersSync = houseMarkersSync ? houseMarkersSync : new HouseMarkersSync());