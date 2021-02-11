import { NotificationType } from '../../../constants/enums/notification-type';
import { CharacterService } from '../../../services/characters/character-service';
import { KeyboardKeys } from '../../../constants/enums/keyboard-keys';
import { RemoteResponse } from '../../../constants/events/remote-response';
import { RemoteEvent } from '../../../constants/events/remote-event';

class Speedometer {
  private readonly browser: BrowserMp;

  private characterId: number;

  private isDriver: boolean;
  private isOwner: boolean;

  private isBlinking: boolean;
  private leftTurn: boolean;
  private rightTurn: boolean;

  private engine: boolean;
  private fuel: number;
  private fuelTank: number;
  private fuelConsumption: number;
  private locked: boolean;
  private seatBelt: boolean;
  private mileage: number;

  private vehicle: VehicleMp | undefined;
  private updaterIntervalId: number | undefined;
  private blinkIntervalId: number | undefined;

  constructor() {
    this.browser = mp.browsers.new('package://components/HUD/Speedometer/speedometer.html');

    this.characterId = CharacterService.GetCharacterId();

    this.isDriver = false;
    this.isOwner = false;

    this.isBlinking = false;
    this.leftTurn = false;
    this.rightTurn = false;

    this.engine = false;
    this.fuel = 0;
    this.fuelTank = 0;
    this.fuelConsumption = 0;
    this.locked = false;
    this.seatBelt = true;
    this.mileage = 0;

    mp.events.add(RageEnums.EventKey.PLAYER_ENTER_VEHICLE, (v: VehicleMp, s: number) => this.OnPlayerEnterVehicle(v, s));
    mp.events.add(RageEnums.EventKey.PLAYER_LEAVE_VEHICLE, () => this.OnPlayerExitVehicle());
  }

  private OnPlayerEnterVehicle(vehicle: VehicleMp, seat: number): void {
    this.vehicle = vehicle;
    // wiki: https://wiki.rage.mp/index.php?title=Player_Config_Flags
    mp.players.local.setConfigFlag(184, true);

    mp.keys.bind(KeyboardKeys.Quote, true, () => this.SetSeatBelt(!this.seatBelt));

    this.isOwner = this.vehicle.getVariable('OwnerId') === this.characterId;
    this.isDriver = seat === -1;
    if (!this.isDriver) {
      this.updaterIntervalId = setInterval(() => this.NonDriver(), 100);
      return;
    }

    mp.game.vehicle.defaultEngineBehaviour = false;
    // wiki: https://wiki.rage.mp/index.php?title=Player_Config_Flags
    mp.players.local.setConfigFlag(429, true);
    this.vehicle.setEngineOn(false, false, true);

    this.engine = this.vehicle.getVariable('EngineStatus') as boolean;
    this.fuel = this.vehicle.getVariable('Fuel') as number;
    this.fuelConsumption = this.vehicle.getVariable('FuelConsumption') as number;
    this.fuelTank = this.vehicle.getVariable('TankSize') as number;
    this.mileage = this.vehicle.getVariable('Mileage') as number;

    const engineMultiplier = this.vehicle.getVariable('EngineMultiplier') as number;
    this.vehicle.setEnginePowerMultiplier(engineMultiplier);

    this.updaterIntervalId = setInterval(() => this.UpdateSpeedometer(), 100);

    mp.keys.bind(KeyboardKeys.LeftArrow, true, () => this.LeftTurn());
    mp.keys.bind(KeyboardKeys.RightArrow, true, () => this.RightTurn());
    mp.keys.bind(KeyboardKeys.UpArrow, true, () => this.EmergencySignal());
    mp.keys.bind(KeyboardKeys.KeyB, true, () => this.SetEngineStatus());
    mp.keys.bind(KeyboardKeys.KeyL, true, () => this.SetLockDoor());

    this.browser.execute(`window.speedometerUi.Show();`);
  }

  private OnPlayerExitVehicle(): void {
    clearInterval(this.updaterIntervalId);
    mp.keys.unbind(KeyboardKeys.LeftArrow, true);
    mp.keys.unbind(KeyboardKeys.RightArrow, true);
    mp.keys.unbind(KeyboardKeys.UpArrow, true);
    mp.keys.unbind(KeyboardKeys.KeyB, true);
    mp.keys.unbind(KeyboardKeys.KeyL, true);
    mp.keys.unbind(KeyboardKeys.Quote, true);

    mp.players.local.setConfigFlag(32, true);

    if (this.isBlinking) this.StopBlinking();
    if (this.isDriver) mp.events.callRemote(RemoteEvent.VehicleSave, this.vehicle, this.fuel)

    this.browser.execute(`window.speedometerUi.Hide();`);
  }

  private NonDriver() {
    if (!this.vehicle) return;

    const speed = this.vehicle.getSpeed();
    this.browser.execute(`window.speedometerUi.UpdateSpeed(${speed});`);
  }

  private SetEngineStatus(): void {
    if (mp.gui.cursor.visible) return;
    if (!this.vehicle) return;
    if (!this.isOwner) return mp.events.call(RemoteResponse.NotificationSent, NotificationType.Error, 'У вас нет ключей от данного транспорта');
    if (this.vehicle.getHealth() <= 0) return mp.events.call(RemoteResponse.NotificationSent, NotificationType.Error, 'Данное ТС уничтожено');
    if (this.fuel === 0) return mp.events.call(RemoteResponse.NotificationSent, NotificationType.Error, 'Бак пуст');

    this.engine = this.vehicle.getIsEngineRunning() === 0 ? true : false;
    mp.events.callRemote(RemoteEvent.VehicleToggleEngine, this.vehicle);

    const notification = this.engine ? 'Двигатель запущен' : 'Двигатель остановлен';
    mp.events.call(RemoteResponse.NotificationSent, NotificationType.Info, notification);
  }

  private SetSeatBelt(enabled: boolean): void {
    if (mp.gui.cursor.visible) return;
    // wiki: https://wiki.rage.mp/index.php?title=Player_Config_Flags
    mp.players.local.setConfigFlag(32, enabled);
    this.seatBelt = enabled;

    const notification = this.seatBelt ? 'Ремень безопасности снят' : 'Ремень безопасности надет';
    mp.events.call(RemoteResponse.NotificationSent, NotificationType.Info, notification);
  }

  // TODO: Create setting lock door outside car

  private SetLockDoor(): void {
    if (!this.vehicle) return;
    if (mp.gui.cursor.visible) return;
    if (!this.isOwner) return mp.events.call(RemoteResponse.NotificationSent, NotificationType.Error, 'У вас нет ключей от данного транспорта');
    this.locked = this.vehicle.getDoorLockStatus() !== 2 ? true : false;

    mp.events.callRemote(RemoteEvent.VehicleToggleLocked, this.vehicle, this.locked);

    const notification = this.locked ? 'Транспортное средство закрыто' : 'Транспортное средство открыто';
    mp.events.call(RemoteResponse.NotificationSent, NotificationType.Info, notification);
  }

  private StopBlinking(): void {
    clearInterval(this.blinkIntervalId);
    this.isBlinking = false;
    this.rightTurn = false;
    this.leftTurn = false;
    mp.players.local.vehicle.setIndicatorLights(1, false);
    mp.players.local.vehicle.setIndicatorLights(0, false);
  }

  private EmergencySignal(): void {
    if (mp.gui.cursor.visible) return;

    if (this.isBlinking) return this.StopBlinking();
    this.isBlinking = true;
    this.blinkIntervalId = setInterval(() => this.Blinking(true, true), 500);
  }

  private LeftTurn(): void {
    if (mp.gui.cursor.visible) return;

    if (this.isBlinking) return this.StopBlinking();
    this.isBlinking = true;
    this.blinkIntervalId = setInterval(() => this.Blinking(true, false), 500);
  }

  private RightTurn(): void {
    if (mp.gui.cursor.visible) return;

    if (this.isBlinking) return this.StopBlinking();
    this.isBlinking = true;
    this.blinkIntervalId = setInterval(() => this.Blinking(false, true), 500);
  }

  private Blinking(IsLeft: boolean, IsRight: boolean): void {
    if (IsLeft && IsRight) {
      this.leftTurn = !this.leftTurn;
      this.rightTurn = !this.rightTurn;
      mp.players.local.vehicle.setIndicatorLights(1, this.leftTurn);
      mp.players.local.vehicle.setIndicatorLights(0, this.rightTurn);
      return;
    }
    if (IsLeft) {
      this.leftTurn = !this.leftTurn;
      mp.players.local.vehicle.setIndicatorLights(1, this.leftTurn);
    } else {
      this.rightTurn = !this.rightTurn;
      mp.players.local.vehicle.setIndicatorLights(0, this.rightTurn);
    }
  }

  // TODO: Realize all functions on Closed Beta Test

  private UpdateSpeedometer(): void {
    if (!this.vehicle) return;

    const speed = this.vehicle.getSpeed();
    const trip = speed / 1000;
    const lights = (this.vehicle as any).getLightsState(1, 1);
    const lowBeam: boolean = lights.lightsOn;
    const highBeam: boolean = lights.highbeamsOn;

    this.mileage += trip;

    this.fuel -= (this.fuelConsumption * trip / 10);
    if (this.fuel <= 0) {
      this.fuel = 0;
      this.vehicle.setEngineOn(false, false, false);
    }
    if (this.vehicle.getHealth() <= 0) {
      this.vehicle.setEngineOn(false, false, false);
      mp.events.call(RemoteResponse.NotificationSent, NotificationType.Error, 'Данное ТС уничтожено');
    }

    this.browser.execute(`window.speedometerUi.Update(${speed}, ${this.leftTurn}, ${lowBeam}, ${highBeam}, ${this.locked}, ${this.rightTurn}, ${this.fuel}, ${this.fuelTank});`);
  }
};

let speedometer: Speedometer;
mp.events.add(RemoteResponse.CharacterCreatorCreated, () => speedometer = speedometer ? speedometer : new Speedometer());
mp.events.add(RemoteResponse.CharacterSelected, () => speedometer = speedometer ? speedometer : new Speedometer());