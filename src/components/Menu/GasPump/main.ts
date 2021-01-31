import { KeyboardKeys } from '../../../Constants/enums/keyboard-keys';
import { NotificationType } from '../../../Constants/enums/notification-type';
import { RemoteResponse } from '../../../constants/events/remote-response';
import { CharacterService } from '../../../services/characters/character-service';
import { RemoteEvent } from '../../../constants/events/remote-event';
import { Character } from '../../../models/characters/character';

class GasPump {
  private readonly browser: BrowserMp;
  private readonly character: Character | undefined;

  private vehicle: VehicleMp | undefined;

  constructor() {
    this.browser = mp.browsers.new('package://components/Menu/House/house.html');
    this.character = CharacterService.Get();

    mp.events.add(RageEnums.EventKey.PLAYER_ENTER_COLSHAPE, (cs: ColshapeMp) => this.PlayerEnterColShape(cs));
    mp.events.add(RageEnums.EventKey.PLAYER_EXIT_COLSHAPE, () => this.PlayerExitColShape());

    mp.events.add(RageEnums.EventKey.PLAYER_ENTER_VEHICLE, (v: VehicleMp) => this.OnPlayerEnterVehicle(v));
    mp.events.add(RageEnums.EventKey.PLAYER_LEAVE_VEHICLE, () => this.OnPlayerExitVehicle());
  }

  private PlayerEnterColShape(colShape: ColshapeMp): void {
    if (this.vehicle === undefined) return;

    const gasPumpColShape = (colShape as any).hasVariable('DummyEntity') && colShape.getVariable('DummyEntity') === 'GasPump';
    if (!gasPumpColShape) return;

    const gasPumpId = colShape.getVariable('Id') as number;

    mp.events.call(RemoteResponse.NotificationSent, NotificationType.Info, 'Нажмите Е для открытия меню заправки');
    mp.keys.bind(KeyboardKeys.KeyE, true, () => this.Show());
  }

  private PlayerExitColShape(): void {
    mp.keys.unbind(KeyboardKeys.KeyE, true);
  }

  private OnPlayerEnterVehicle(vehicle: VehicleMp): void {
    this.vehicle = vehicle;
  }

  private OnPlayerExitVehicle(): void {
    this.vehicle = undefined;
  }

  private Show(): void {
    // this.browser.execute(`window.gasPumpUi.Show();`);
  }

  private Hide(): void {
    // this.browser.reload(false);
    // this.MenuCursorVisible(false, false);

    // this.browser.execute(`window.gasPumpUi.Hide();`);
  }

  private MenuCursorVisible(freezeControls: boolean, visible: boolean): void {
    mp.gui.cursor.show(freezeControls, visible);
  }
}

let gasPump: GasPump | undefined;
mp.events.add(RemoteEvent.CharacterSpawnSelect, () => gasPump = gasPump ? gasPump : new GasPump());