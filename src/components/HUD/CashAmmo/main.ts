import { Character } from '../../../models/characters/character';
import { CharacterService } from '../../../services/characters/character-service';
import { RemoteResponse } from '../../../constants/events/remote-response';

class CashAmmo {
  private readonly browser: BrowserMp;
  private readonly character: Character;

  constructor() {
    this.browser = mp.browsers.new('package://components/HUD/CashAmmo/cash-ammo.html');
    this.character = CharacterService.Get();

    setInterval(() => this.UpdateCash(), 1000);
    setInterval(() => this.UpdateAmmo(), 100);
  }

  private UpdateCash(): void {
    this.browser.execute(`window.cashAmmoUi.UpdateCash(${this.character.cash});`);
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