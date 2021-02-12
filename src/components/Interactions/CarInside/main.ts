import { NotificationType } from '../../../constants/enums/notification-type';
import { RemoteEvent } from '../../../constants/events/remote-event';
import { CharacterService } from '../../../services/characters/character-service';
import { KeyboardKeys } from '../../../constants/enums/keyboard-keys';
import { RemoteResponse } from '../../../constants/events/remote-response';
import { LocalEvent } from '../../../constants/events/local-event';

class InteractionCarInside {
  private static vehicle: VehicleMp;
  private browser: BrowserMp;

  private characterId: number;
  private locked: boolean;
  private isOwner: boolean;
  private engine: boolean;
  private fuel: number;

  constructor() {
    this.browser = mp.browsers.new('package://components/Interactions/CarInside/car-inside.html');

    this.characterId = CharacterService.GetCharacterId();
    this.locked = false;
    this.isOwner = false;

    this.engine = false;
    this.fuel = 0;

    mp.events.add(RageEnums.EventKey.PLAYER_ENTER_VEHICLE, (v, s) => {
      const isDriver = s === -1;
      if (!isDriver) return;

      InteractionCarInside.vehicle = v;

      this.fuel = InteractionCarInside.vehicle.getVariable('Fuel');
      this.isOwner = InteractionCarInside.vehicle.getVariable('OwnerId') === this.characterId;
      this.engine = InteractionCarInside.vehicle.getIsEngineRunning() === 0 ? true : false;
      this.locked = InteractionCarInside.vehicle.getDoorLockStatus() !== 2 ? true : false;

      this.ToggleBinds(true);
    });

    mp.events.add(RageEnums.EventKey.PLAYER_LEAVE_VEHICLE, () => {
      this.ToggleBinds(false);
      this.browser.execute(`window.interactionCarInsideUi.Hide();`);
    });

    mp.events.add(LocalEvent.InteractionCarInsideToggleEngine, () => this.SetEngineStatus());
    mp.events.add(LocalEvent.InteractionCarInsideToggleLock, () => this.SetLockStatus());
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
      mp.gui.cursor.show(true, true);
      this.browser.execute(`window.interactionCarInsideUi.Show();`);
    } else {
      mp.gui.cursor.show(false, false);
      this.browser.execute(`window.interactionCarInsideUi.Hide();`);
    }
  }

  private TakePassengers(): PlayerMp[] {
    let players = [] as PlayerMp[];

    for (let seat = 0; seat < InteractionCarInside.vehicle.getMaxNumberOfPassengers(); seat++) {
      const pedInSeat = InteractionCarInside.vehicle.getPedInSeat(seat);
      players[seat] = mp.players.atHandle(pedInSeat);
    }

    return players;
  }

  private SetLockStatus(): void {
    if (!InteractionCarInside.vehicle) return;
    if (!mp.gui.cursor.visible) return;

    this.locked = InteractionCarInside.vehicle.getDoorLockStatus() !== 2 ? true : false;
    mp.events.callRemote(RemoteEvent.VehicleToggleLocked, InteractionCarInside.vehicle, this.locked);

    const notification = this.locked ? 'Транспортное средство закрыто' : 'Транспортное средство открыто';
    mp.events.call(RemoteResponse.NotificationSent, NotificationType.Info, notification);
  }
 

  private SetEngineStatus(): void {
    if (!InteractionCarInside.vehicle) return;
    if (!this.isOwner) return mp.events.call(RemoteResponse.NotificationSent, NotificationType.Error, 'У вас нет ключей от данного транспорта');
    if (InteractionCarInside.vehicle.getHealth() <= 0) return mp.events.call(RemoteResponse.NotificationSent, NotificationType.Error, 'Данное ТС уничтожено');
    if (this.fuel === 0) return mp.events.call(RemoteResponse.NotificationSent, NotificationType.Error, 'Бак пуст');

    this.engine = InteractionCarInside.vehicle.getIsEngineRunning() === 0 ? true : false;
    mp.events.callRemote(RemoteEvent.VehicleToggleEngine, InteractionCarInside.vehicle);

    const notification = this.engine ? 'Двигатель запущен' : 'Двигатель остановлен';
    mp.events.call(RemoteResponse.NotificationSent, NotificationType.Info, notification);
  }
};

let interactionCarInside: InteractionCarInside;
mp.events.add(RemoteResponse.CharacterSelected, () => interactionCarInside = interactionCarInside ? interactionCarInside : new InteractionCarInside());