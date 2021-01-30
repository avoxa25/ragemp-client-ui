import { RemoteResponse } from '../../Constants/remote-response';
import { MouseKeys } from '../../Constants/mouse-keys';

class InteractionCarInside {
  private static vehicle: VehicleMp;
  private browser: BrowserMp;

  constructor() {
    this.browser = mp.browsers.new('package://Interactions/CarInside/car-inside.html');

    mp.events.add(RageEnums.EventKey.PLAYER_ENTER_VEHICLE, (v) => {
      InteractionCarInside.vehicle = v;
      this.ToggleBinds(true);
    });

    mp.events.add(RageEnums.EventKey.PLAYER_LEAVE_VEHICLE, () => {
      this.ToggleBinds(false);
    });
  }

  private ToggleBinds(isActive: boolean): void {
    if(isActive){
      mp.keys.bind(MouseKeys.Middle, true, () => this.ToggleMenu(true));
      mp.keys.bind(MouseKeys.Middle, false, () => this.ToggleMenu(false));
    }
    else{
      mp.keys.unbind(MouseKeys.Middle, true, () => this.ToggleMenu(true));
      mp.keys.unbind(MouseKeys.Middle, false, () => this.ToggleMenu(false));
    }
  }

  private ToggleMenu(isActive: boolean): void {
    if(isActive){
      // TODO show menu
    }
    else{
      // TODO hide menu
    }
  }
};

let interactionCarInside: InteractionCarInside;
mp.events.add(RemoteResponse.CharacterSelected, () => interactionCarInside = interactionCarInside ? interactionCarInside : new InteractionCarInside());