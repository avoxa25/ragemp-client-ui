import { BlipConstants } from '../Constants/blip.constants';
import { RemoteResponse } from '../Constants/remote-response';

class HouseBlipsSync {
  private readonly characterId: number;
  private readonly clientBlips: { [name: number]: BlipMp };

  constructor() {
    const rawId = mp.players.local.getVariable('Id') as string;
    this.characterId = Number.parseInt(rawId);

    mp.console.logInfo(`rawId: ${rawId}`);
    mp.console.logInfo(`characterId: ${this.characterId}`);

    this.clientBlips = {};

    this.Initialize();
    setInterval(() => this.Sync(), 1000);
  }

  private Initialize(): void {
    this.GetServerBlips().forEach(b => {
      mp.console.logInfo('Initialize');

      const rawId = b.getVariable('Id') as string;
      const rawOwnerId = b.getVariable('OwnerId') as string;
      const rawOnSale = b.getVariable('OnSale') as string;

      const id = Number.parseInt(rawId);
      const ownerId = Number.parseInt(rawOwnerId);
      const onSale = rawOnSale === 'true';

      const position = b.getCoords();

      let color = BlipConstants.HouseDefaultColor;
      color = onSale ? BlipConstants.HouseOnSaleColor : color;
      color = this.characterId === ownerId ? BlipConstants.HouseOwnedColor : color;

      const clientBlip = mp.blips.new(
        BlipConstants.HouseSprite,
        position,
        {
          alpha: BlipConstants.HouseAlpha,
          color: color,
          dimension: BlipConstants.HouseDimension,
          drawDistance: BlipConstants.HouseDrawDistance,
          name: BlipConstants.HouseName,
          rotation: BlipConstants.HouseRotation,
          scale: BlipConstants.HouseScale,
          shortRange: BlipConstants.HouseShortRange
        });

      this.clientBlips[id] = clientBlip;
    });
  }

  private Sync(): void {
    this.GetServerBlips().forEach(b => {
      const rawId = b.getVariable('Id') as string;
      const rawOwnerId = b.getVariable('OwnerId') as string;
      const rawOnSale = b.getVariable('OnSale') as string;

      const id = Number.parseInt(rawId);
      const ownerId = Number.parseInt(rawOwnerId);
      const onSale = rawOnSale === 'true';

      let color = BlipConstants.HouseDefaultColor;
      color = onSale ? BlipConstants.HouseOnSaleColor : color;
      color = this.characterId === ownerId ? BlipConstants.HouseOwnedColor : color;

      const clientBlip = this.clientBlips[id];
      clientBlip.setColour(color);
    });
  }

  private GetServerBlips(): BlipMp[] {
    return mp.blips
      .toArray()
      .filter(b => b.dimension === 4294967295)
      .filter(b => b.hasVariable('Exists'))
      .filter(b => b.hasVariable('Type') && b.getVariable('Type') === 'House');
  }
};

let houseBlipsSync: HouseBlipsSync | undefined;
mp.events.add(RemoteResponse.CharacterSelected, () => houseBlipsSync = houseBlipsSync ? houseBlipsSync : new HouseBlipsSync());