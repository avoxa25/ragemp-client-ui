import { RemoteResponse } from '../../Constants/remote-response';

class HudLocation {
  private readonly browser: BrowserMp;

  constructor() {
    this.browser = mp.browsers.new('package://HUD/Location/location.html');
    setInterval(() => this.Update(), 3000);
  }

  private Update(): void {
    const playerStreet = mp.game.pathfind.getStreetNameAtCoord(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, 0, 0);

    const streetName = mp.game.ui.getStreetNameFromHashKey(playerStreet.streetName);
    const crossingRoad = mp.game.ui.getStreetNameFromHashKey(playerStreet.crossingRoad);

    this.browser.execute(`window.hudLocationUi.Update("${streetName}", "${crossingRoad}");`);
  }
};

mp.events.add(RemoteResponse.LoginSuccess, () => new HudLocation());  