import { BlipConstants } from '../constants/blip.constants';
import { RemoteResponse } from '../models/enums/events/remote-response.enum';

class GasStationBlipsSync {
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
    this.GetServerBlips().forEach(b => {
      b.setDisplay(0);

      const id = b.getVariable('Id') as number;
      const ownerId = b.getVariable('OwnerId') as number | null;
      const onSale = b.getVariable('OnSale') as boolean;

      const position = b.getCoords();

      let color = BlipConstants.GasStationOccupiedColor;
      color = onSale ? BlipConstants.GasStationOnSaleColor : color;
      color = this.characterId === ownerId ? BlipConstants.GasStationOwnedColor : color;

      let name = BlipConstants.GasStationOccupiedName;
      name = onSale ? BlipConstants.GasStationOnSaleName : name;
      name = this.characterId === ownerId ? BlipConstants.GasStationOwnedName : name;

      const clientBlip = mp.blips.new(
        BlipConstants.GasStationSprite,
        position,
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

      this.clientBlips[id] = clientBlip;
    });
  }

  private Sync(): void {
    this.GetServerBlips().forEach(b => {
      const id = b.getVariable('Id') as number;
      const ownerId = b.getVariable('OwnerId') as number | null;
      const onSale = b.getVariable('OnSale') as boolean;

      let color = BlipConstants.GasStationOccupiedColor;
      color = onSale ? BlipConstants.GasStationOnSaleColor : color;
      color = this.characterId === ownerId ? BlipConstants.GasStationOwnedColor : color;

      let name = BlipConstants.GasStationOccupiedName;
      name = onSale ? BlipConstants.GasStationOnSaleName : name;
      name = this.characterId === ownerId ? BlipConstants.GasStationOwnedName : name;

      const clientBlip = this.clientBlips[id];
      clientBlip.setColour(color);
      (clientBlip as any).name = name;
    });
  }

  private GetServerBlips(): BlipMp[] {
    return mp.blips
      .toArray()
      .filter(b => b.hasVariable('DummyEntity') && b.getVariable('DummyEntity') === 'GasStation');
  }
}

let gasStationBlipsSync: GasStationBlipsSync | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => gasStationBlipsSync = gasStationBlipsSync ? gasStationBlipsSync : new GasStationBlipsSync());