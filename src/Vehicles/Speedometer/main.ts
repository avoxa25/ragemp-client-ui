import { RemoteResponse } from '../../Constants/remote-response';

const Keys = {
  LeftArrow: 0x25,
  RightArrow: 0x27
};

class Speedometer {
  private readonly browser: BrowserMp;

  private isBlinking: boolean;
  private leftTurn: boolean;
  private rightTurn: boolean;

  private vehicle: VehicleMp | undefined;
  private updaterIntervalId: number | undefined;
  private blinkIntervalId: number | undefined;

  constructor() {
    this.browser = mp.browsers.new('package://Speedometer/speedometer.html');

    this.isBlinking = false;
    this.leftTurn = false;
    this.rightTurn = false;

    mp.events.add(RageEnums.EventKey.PLAYER_ENTER_VEHICLE, (v: VehicleMp, s: number) => this.OnPlayerEnterVehicle(v, s));
    mp.events.add(RageEnums.EventKey.PLAYER_LEAVE_VEHICLE, () => this.OnPlayerExitVehicle());
  }

  private OnPlayerEnterVehicle(vehicle: VehicleMp, seat: number): void {
    const isDriver = seat === -1;
    if (!isDriver) return;

    this.vehicle = vehicle;
    this.updaterIntervalId = setInterval(() => this.UpdateSpeedometer(), 100);

    mp.keys.bind(Keys.LeftArrow, true, this.LeftTurn);
    mp.keys.bind(Keys.RightArrow, true, this.RightTurn);

    this.browser.execute(`window.speedometerUi.Show();`);
  }

  private OnPlayerExitVehicle(): void {
    clearInterval(this.updaterIntervalId);
    mp.keys.unbind(Keys.LeftArrow, true, this.LeftTurn);
    mp.keys.unbind(Keys.RightArrow, true, this.RightTurn);

    if (this.isBlinking) {
      this.StopBlinking();
    }

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

  private LeftTurn(): void {
    if (this.isBlinking) {
      this.StopBlinking();
    } else {
      this.isBlinking = true;
      this.blinkIntervalId = setInterval(() => this.Blinking(true), 500);
    }
  }

  private RightTurn(): void {
    if (this.isBlinking) {
      this.StopBlinking();
    } else {
      this.isBlinking = true;
      this.blinkIntervalId = setInterval(() => this.Blinking(false), 500);
    }
  }

  private Blinking(IsLeft: boolean): void {
    if (IsLeft) {
      this.leftTurn = !this.leftTurn;
      mp.players.local.vehicle.setIndicatorLights(1, this.leftTurn);
    } else {
      this.rightTurn = !this.rightTurn;
      mp.players.local.vehicle.setIndicatorLights(0, this.rightTurn);
    }
  }

  private UpdateSpeedometer(): void {
    const leftTurn = this.leftTurn;
    const rightTurn = this.rightTurn;

    const speed = this.vehicle?.getSpeed();

    const lights = (this.vehicle as any).getLightsState(1, 1);
    const lowBeam: boolean = lights.lightsOn;
    const highBeam: boolean = lights.highbeamsOn;

    const locked = this.vehicle?.getDoorLockStatus();

    const fuel = this.vehicle?.getVariable('Fuel') as number;
    const fuelTank = this.vehicle?.getVariable('TankSize') as number;

    this.browser.execute(`window.speedometerUi.Update(${speed}, ${leftTurn}, ${lowBeam}, ${highBeam}, ${locked}, ${rightTurn}, ${fuel}, ${fuelTank});`);
  }
};

let speedometer: Speedometer;
mp.events.add(RemoteResponse.CharacterSelected, () => speedometer = speedometer ? speedometer : new Speedometer());