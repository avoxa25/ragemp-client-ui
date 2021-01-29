import { RemoteResponse } from "../../Constants/remote-response";

class CashAndAmmo {
  private readonly browser: BrowserMp;

  constructor() {
    this.browser = mp.browsers.new('package://HUD/CashAmmo/cash-ammo.html');

    mp.events.add(RemoteResponse.CharacterMoneyChanged, () => this.UpdateCash());
  }

  private UpdateCash(): void {
    const cash = mp.players.local.getVariable('Cash');
    this.browser.execute(`window.cashAndAmmoUi.UpdateCash("${cash}");`);
  }
}

// TODO: Create correct displaying ammo

let cashAndAmmo: CashAndAmmo | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => cashAndAmmo = cashAndAmmo ? cashAndAmmo : new CashAndAmmo());