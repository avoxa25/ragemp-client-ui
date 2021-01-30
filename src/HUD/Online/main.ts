import { RemoteResponse } from '../../Constants/remote-response';

class Online {
  private browser: BrowserMp;

  public constructor() {
    this.browser = mp.browsers.new('package://HUD/Online/online.html');

    setInterval(() => this.SetCurrentOnline(), 100);
  }

  private SetCurrentOnline(){
    this.browser.execute(`window.onlineUi.SetCurrentOnline('${mp.players.length}');`); 
  }
};

let online: Online | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => online = online ? online : new Online());