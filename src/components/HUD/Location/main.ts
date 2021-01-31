import { RemoteResponse } from '../../../models/enums/events/remote-response.enum';
import { ZoneData } from '../../../models/static/zone-data';

class HudLocation {
  private readonly browser: BrowserMp;

  constructor() {
    this.browser = mp.browsers.new('package://components/HUD/Location/location.html');
    setInterval(() => this.Update(), 1000);
  }

  private Update(): void {
    const streetHashCodes = mp.game.pathfind.getStreetNameAtCoord(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, 0, 0);
    const streetName = mp.game.ui.getStreetNameFromHashKey(streetHashCodes.streetName);
    const crossingRoad = mp.game.ui.getStreetNameFromHashKey(streetHashCodes.crossingRoad);

    const zoneId = mp.game.zone.getNameOfZone(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z);
    const zone = ZoneData.GetZoneName(zoneId);

    this.browser.execute(`window.hudLocationUi.Update("${streetName}", "${crossingRoad}", "${zone}");`);
  }
}

let hudLocation: HudLocation | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => hudLocation = hudLocation ? hudLocation : new HudLocation());