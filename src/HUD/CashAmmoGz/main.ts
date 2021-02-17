import { RemoteResponse } from '../../Constants/remote-response';

class CashAmmo {
  private readonly browser: BrowserMp;

  constructor() {
    this.browser = mp.browsers.new('package://HUD/CashAmmoGZ/cash-ammo-gz.html');

    mp.events.add(RemoteResponse.CharacterMoneyChanged, () => this.UpdateCash());
    setInterval(() => this.UpdateAmmo(), 5000);
  }

  private UpdateCash(): void {
    const cash = mp.players.local.getVariable('Cash');
    this.browser.execute(`window.cashAmmoGz.UpdateCash(${cash});`);
  }

  private UpdateAmmo(): void {
    const weaponHash = mp.players.local.weapon;
    const clip = mp.players.local.getAmmoInClip(weaponHash);
    const total = (mp.players.local as any).getWeaponAmmo(weaponHash) as number;

    mp.console.logInfo(`weaponHash: ${weaponHash}`);
    mp.console.logInfo(`clip: ${clip}`);
    mp.console.logInfo(`total: ${total}`);

    // TODO: Check if weapon is not melee
    if (clip === 0 && total === 0) {
      this.browser.execute('window.cashAmmoGz.HideAmmo();');
    } else {
      this.browser.execute('window.cashAmmoGz.ShowAmmo();');
      this.browser.execute(`window.cashAmmoGz.SetAmmo(${clip}, ${total});`);
    }
  }
}

let cashAmmo: CashAmmo | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => cashAmmo = cashAmmo ? cashAmmo : new CashAmmo()); 