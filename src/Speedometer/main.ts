const Keys = {
  LeftArrow: 0x25,
  RightArrow: 0x27
};

abstract class Speedometer {
  private static browser: BrowserMp;
  private static vehicle: VehicleMp;
  private static updaterIntervalId: number;
  private static blinkIntervalId: number;
  private static isBlinking: boolean;
  private static leftTurn: boolean;
  private static rightTurn: boolean;

  public static Start(): void {
    Speedometer.isBlinking = false;
    Speedometer.leftTurn = false;
    Speedometer.rightTurn = false;

    mp.events.add(RageEnums.EventKey.PLAYER_ENTER_VEHICLE, (v: VehicleMp, s: number) => Speedometer.OnPlayerEnterVehicle(v, s));
    mp.events.add(RageEnums.EventKey.PLAYER_LEAVE_VEHICLE, () => Speedometer.OnPlayerExitVehicle());

    Speedometer.browser = mp.browsers.new('package://Speedometer/speedometer.html');
  }

  private static OnPlayerEnterVehicle(vehicle: VehicleMp, seat: number): void {
    const isDriver = seat === -1;
    if (!isDriver) return;

    Speedometer.vehicle = vehicle;
    Speedometer.updaterIntervalId = setInterval(() => Speedometer.UpdateSpeedometer(), 100);

    mp.keys.bind(Keys.LeftArrow, true, Speedometer.LeftTurn);
    mp.keys.bind(Keys.RightArrow, true, Speedometer.RightTurn);

    Speedometer.browser.execute(`window.speedometerUi.Show();`);
  }

  private static OnPlayerExitVehicle(): void {
    clearInterval(Speedometer.updaterIntervalId);
    mp.keys.unbind(Keys.LeftArrow, true, Speedometer.LeftTurn);
    mp.keys.unbind(Keys.RightArrow, true, Speedometer.RightTurn);

    if (Speedometer.isBlinking) {
      Speedometer.StopBlinking();
    }

    Speedometer.browser.execute(`window.speedometerUi.Hide();`);
  }

  private static StopBlinking(): void {
    clearInterval(Speedometer.blinkIntervalId);
    Speedometer.isBlinking = false;
    Speedometer.rightTurn = false;
    Speedometer.leftTurn = false;
    mp.players.local.vehicle.setIndicatorLights(1, false);
    mp.players.local.vehicle.setIndicatorLights(0, false);
  }

  private static LeftTurn(): void {
    if (Speedometer.isBlinking) {
      Speedometer.StopBlinking();
    } else {
      Speedometer.isBlinking = true;
      Speedometer.blinkIntervalId = setInterval(() => Speedometer.Blinking(true), 500);
    }
  }

  private static RightTurn(): void {
    if (Speedometer.isBlinking) {
      Speedometer.StopBlinking();
    } else {
      Speedometer.isBlinking = true;
      Speedometer.blinkIntervalId = setInterval(() => Speedometer.Blinking(false), 500);
    }
  }

  private static Blinking(IsLeft: boolean): void {
    if (IsLeft) {
      Speedometer.leftTurn = !Speedometer.leftTurn;
      mp.players.local.vehicle.setIndicatorLights(1, Speedometer.leftTurn);
    } else {
      Speedometer.rightTurn = !Speedometer.rightTurn;
      mp.players.local.vehicle.setIndicatorLights(0, Speedometer.rightTurn);
    }
  }

  private static UpdateSpeedometer(): void {
    const leftTurn = Speedometer.leftTurn;
    const rightTurn = Speedometer.rightTurn;

    const speed = Speedometer.vehicle.getSpeed();
    const lights = (Speedometer.vehicle as any).getLightsState(1, 1);
    const lowBeam: boolean = lights.lightsOn;
    const highBeam: boolean = lights.highbeamsOn;

    // TODO: locked should be boolean. Not number
    const locked = Speedometer.vehicle.getDoorLockStatus();

    const rawFuel = Speedometer.vehicle.getVariable('Fuel');
    const fuel = Number.parseFloat(rawFuel);

    const rawFuelTank = Speedometer.vehicle.getVariable('TankSize');
    const fuelTank = Number.parseFloat(rawFuelTank);

    Speedometer.browser.execute(`window.speedometerUi.Update(${speed}, ${leftTurn}, ${lowBeam}, ${highBeam}, ${locked}, ${rightTurn}, ${fuel}, ${fuelTank});`);
  }
};

Speedometer.Start();