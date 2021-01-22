abstract class HudLocation {
  private static browser: BrowserMp;

  public static Start(): void {
    HudLocation.browser = mp.browsers.new('package://HUD/Location/location.html');

    setInterval(() => HudLocation.Update(), 3000);
  }

  private static Update(): void {
    const playerStreet = mp.game.pathfind.getStreetNameAtCoord(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, 0, 0);

    const streetName = mp.game.ui.getStreetNameFromHashKey(playerStreet.streetName);
    const crossingRoad = mp.game.ui.getStreetNameFromHashKey(playerStreet.crossingRoad);

    HudLocation.browser.execute(`window.hudLocationUi.Update("${streetName}", "${crossingRoad}");`);
  }
};

HudLocation.Start();