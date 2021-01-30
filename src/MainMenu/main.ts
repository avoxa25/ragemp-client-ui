import { RemoteEvents } from '../Constants/remote-events';
import { KeyboardKeys } from '../Constants/keyboard-keys';
import { RemoteResponse } from '../Constants/remote-response';
import { LocalEvents } from '../Constants/local-events';

class MainMenu {
  private isActive: boolean = false;
  private readonly browser: BrowserMp;

  constructor() {
    this.isActive = false;
    this.browser = mp.browsers.new('package://MainMenu/main-menu.html');

    mp.keys.bind(KeyboardKeys.KeyM, true, () => this.Toogle());
    mp.events.add(RemoteResponse.MainMenuOpened, (d: string) => this.Open(d));
    mp.events.add(LocalEvents.MenuToggle, (b: boolean) => this.isActive = b);
  }

  private Toogle(): void {
    this.isActive = !this.isActive;
    if(this.isActive){
      mp.events.callRemote(RemoteEvents.MainMenuOpen);
    } else{
      this.browser.execute(`window.mainMenuUi.Hide();`);
    }
  }

  private Open(dataJson: string): void {
    const data = JSON.parse(dataJson);
    this.browser.execute(`window.mainMenuUi.Show(${data.name}, ${data.surname}, ${data.gender}, ${data.job}, ${data.playedTime} ${data.org}, ${data.orgRank}, ${data.cash});`);
  }
}

let mainMenu: MainMenu;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => mainMenu = mainMenu ? mainMenu : new MainMenu());