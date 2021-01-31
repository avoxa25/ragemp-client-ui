import { RemoteResponse } from '../../../models/enums/events/remote-response.enum';

class Online {
  private readonly browser: BrowserMp;

  public constructor() {
    this.browser = mp.browsers.new('package://components/HUD/Online/online.html');

    setInterval(() => this.UpdateOnline(), 1000);
  }

  private UpdateOnline(): void {
    // TODO: Get max online from server
    const online = mp.players.length;
    this.browser.execute(`window.onlineUi.SetOnline('${online}');`);
  }
};

let online: Online | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => online = online ? online : new Online());