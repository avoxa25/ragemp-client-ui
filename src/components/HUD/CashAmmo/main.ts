import { CharacterProvider } from '../../../services/providers/character-provider';
import { RemoteResponse } from '../../../constants/events/remote-response';

class CashAmmo {
  private readonly browser: BrowserMp;
  private readonly characterProvider: CharacterProvider;

  constructor() {
    this.browser = mp.browsers.new('package://components/HUD/CashAmmo/cash-ammo.html');
    this.characterProvider = new CharacterProvider();

    this.characterProvider.Get()
      .subscribe(c => this.UpdateCash(c.cash));

    setInterval(() => this.UpdateAmmo(), 100);
  }

  private UpdateCash(cash: number): void {
    this.browser.execute(`window.cashAmmoUi.UpdateCash(${cash});`);
  }

  private UpdateAmmo(): void {
    const weaponHash = mp.players.local.weapon;
    const clip = mp.players.local.getAmmoInClip(weaponHash);
    const total = (mp.players.local as any).getWeaponAmmo(weaponHash) as number;

    // TODO: Check if weapon is not melee
    if (clip === 0 && total === 0) {
      this.browser.execute('window.cashAmmoUi.HideAmmo();');
    } else {
      this.browser.execute('window.cashAmmoUi.ShowAmmo();');
      this.browser.execute(`window.cashAmmoUi.SetAmmo(${clip}, ${total});`);
    }
  }
}

let cashAmmo: CashAmmo | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => cashAmmo = cashAmmo ? cashAmmo : new CashAmmo());