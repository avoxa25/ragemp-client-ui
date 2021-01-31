import { KeyboardKeys } from '../../../models/enums/keyboard-keys';
import { RemoteResponse } from '../../../models/enums/events/remote-response';

class Speedometer {
  private readonly browser: BrowserMp;

  private isBlinking: boolean;
  private leftTurn: boolean;
  private rightTurn: boolean;

  private fuel: number;
  private fuelTank: number;
  private fuelConsumption: number;
  private locked: boolean;
  private mileage: number;

  private vehicle: VehicleMp | undefined;
  private updaterIntervalId: number | undefined;
  private blinkIntervalId: number | undefined;

  constructor() {
    this.browser = mp.browsers.new('package://components/Speedometer/speedometer.html');

    this.isBlinking = false;
    this.leftTurn = false;
    this.rightTurn = false;

    this.fuel = 0;
    this.fuelTank = 0;
    this.fuelConsumption = 0;
    this.locked = false;
    this.mileage = 0;

    mp.events.add(RageEnums.EventKey.PLAYER_ENTER_VEHICLE, (v: VehicleMp, s: number) => this.OnPlayerEnterVehicle(v, s));
    mp.events.add(RageEnums.EventKey.PLAYER_LEAVE_VEHICLE, () => this.OnPlayerExitVehicle());
  }

  private OnPlayerEnterVehicle(vehicle: VehicleMp, seat: number): void {
    this.vehicle = vehicle;
    this.locked = this.vehicle.getVariable('Locked') as boolean;
    // WIKI: https://wiki.rage.mp/index.php?title=Vehicle::setDoorsLocked
    this.locked ? this.vehicle.setDoorsLocked(2) : this.vehicle.setDoorsLocked(1);
    const isDriver = seat === -1;
    if (!isDriver) return;

    this.fuel = this.vehicle.getVariable('Fuel') as number;
    this.fuelTank = this.vehicle.getVariable('TankSize') as number;
    this.mileage = this.vehicle.getVariable('Mileage') as number;

    this.updaterIntervalId = setInterval(() => this.UpdateSpeedometer(), 100);

    mp.keys.bind(KeyboardKeys.LeftArrow, true, this.LeftTurn);
    mp.keys.bind(KeyboardKeys.RightArrow, true, this.RightTurn);
    mp.keys.bind(KeyboardKeys.UpArrow, true, this.EmergencySignal);

    this.browser.execute(`window.speedometerUi.Show();`);
  }

  private OnPlayerExitVehicle(): void {
    clearInterval(this.updaterIntervalId);
    mp.keys.unbind(KeyboardKeys.LeftArrow, true, this.LeftTurn);
    mp.keys.unbind(KeyboardKeys.RightArrow, true, this.RightTurn);
    mp.keys.unbind(KeyboardKeys.UpArrow, true, this.EmergencySignal);

    if (this.isBlinking) this.StopBlinking();

    this.browser.execute(`window.speedometerUi.Hide();`);
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
    if (this.isBlinking) return this.StopBlinking();
    this.isBlinking = true;
    this.blinkIntervalId = setInterval(() => this.Blinking(true, true), 500);
  }

  private LeftTurn(): void {
    if (this.isBlinking) return this.StopBlinking();
    this.isBlinking = true;
    this.blinkIntervalId = setInterval(() => this.Blinking(true, false), 500);
  }

  private RightTurn(): void {
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

  private UpdateSpeedometer(): void {
    if (!this.vehicle) return;

    const leftTurn = this.leftTurn;
    const rightTurn = this.rightTurn;

    const speed = this.vehicle.getSpeed();
    const trip = speed / 1000;

    const lights = (this.vehicle as any).getLightsState(1, 1);
    const lowBeam: boolean = lights.lightsOn;
    const highBeam: boolean = lights.highBeamsOn;

    this.mileage += trip;

    this.fuel -= this.fuelConsumption * trip;
    if (this.fuel <= 0) {
      this.fuel = 0;
      this.vehicle.setEngineOn(false, false, false);
    }


    this.browser.execute(`window.speedometerUi.Update(${speed}, ${leftTurn}, ${lowBeam}, ${highBeam}, ${this.locked}, ${rightTurn}, ${this.fuel}, ${this.fuelTank});`);
  }
};

let speedometer: Speedometer;
mp.events.add(RemoteResponse.CharacterSelected, () => speedometer = speedometer ? speedometer : new Speedometer());