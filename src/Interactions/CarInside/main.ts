import { KeyboardKeys } from '../../Constants/keyboard-keys';
import { RemoteResponse } from '../../Constants/remote-response';

class InteractionCarInside {
  private static vehicle: VehicleMp;
  private browser: BrowserMp;

  constructor() {
    this.browser = mp.browsers.new('package://Interactions/CarInside/car-inside.html');

    mp.events.add(RageEnums.EventKey.PLAYER_ENTER_VEHICLE, (v, s) => {
      const isDriver = s === -1;
      if (!isDriver) return;

      InteractionCarInside.vehicle = v;
      this.ToggleBinds(true);
    });

    mp.events.add(RageEnums.EventKey.PLAYER_LEAVE_VEHICLE, () => {
      this.ToggleBinds(false);
      this.browser.execute(`window.interactionCarInsideUi.Hide();`);
    });
  }

  private ToggleBinds(isActive: boolean): void {
    if (isActive) {
      mp.keys.bind(KeyboardKeys.KeyY, true, () => this.ToggleMenu(true));
      mp.keys.bind(KeyboardKeys.KeyY, false, () => this.ToggleMenu(false));
    } else {
      mp.keys.unbind(KeyboardKeys.KeyY, true, () => this.ToggleMenu(true));
      mp.keys.unbind(KeyboardKeys.KeyY, false, () => this.ToggleMenu(false));
    }
  }

  private ToggleMenu(isActive: boolean): void {
    // TODO add sending passengers
    if (isActive) {
      this.browser.execute(`window.interactionCarInsideUi.Show();`);
    } else {
      this.browser.execute(`window.interactionCarInsideUi.Hide();`);
    }
  }
};

let interactionCarInside: InteractionCarInside;
mp.events.add(RemoteResponse.CharacterSelected, () => interactionCarInside = interactionCarInside ? interactionCarInside : new InteractionCarInside());