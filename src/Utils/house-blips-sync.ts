import { BlipConstants } from '../Constants/blip.constants';
import { RemoteResponse } from '../Constants/remote-response';

class HouseBlipsSync {
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

      let color = BlipConstants.HouseOccupiedColor;
      color = onSale ? BlipConstants.HouseOnSaleColor : color;
      color = this.characterId === ownerId ? BlipConstants.HouseOwnedColor : color;

      let name = BlipConstants.HouseOccupiedName;
      name = onSale ? BlipConstants.HouseOnSaleName : name;
      name = this.characterId === ownerId ? BlipConstants.HouseOwnedName : name;

      const clientBlip = mp.blips.new(
        BlipConstants.HouseSprite,
        position,
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

      this.clientBlips[id] = clientBlip;
    });
  }

  private Sync(): void {
    this.GetServerBlips().forEach(b => {
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

  private GetServerBlips(): BlipMp[] {
    return mp.blips
      .toArray()
      .filter(b => b.dimension === 4294967295)
      .filter(b => b.hasVariable('Exists') && b.hasVariable('Exists') === false)
      .filter(b => b.hasVariable('Type') && b.getVariable('Type') === 'House');
  }
}

let houseBlipsSync: HouseBlipsSync | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => houseBlipsSync = houseBlipsSync ? houseBlipsSync : new HouseBlipsSync());