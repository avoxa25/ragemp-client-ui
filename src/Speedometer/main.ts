import { LocalEvents } from '../Constants/localEvents';

abstract class Speedometer {
  private static vehicle: VehicleMp;
  private static updaterIntervalId: number;
  private static blinkIntervalId: number;
  private static isBlinking: boolean = false;
  private static leftTurn: boolean = false;
  private static rightTurn: boolean = false;

  public static Start(): void {
    mp.browsers.new('package://Speedometer/speedometer.html');

    mp.events.add(RageEnums.EventKey.PLAYER_ENTER_VEHICLE, (v: VehicleMp, s: number) => Speedometer.OnPlayerEnterVehicle(v, s));
    mp.events.add(RageEnums.EventKey.PLAYER_LEAVE_VEHICLE, () => Speedometer.OnPlayerExitVehicle());
  }

  private static OnPlayerEnterVehicle(vehicle: VehicleMp, seat: number): void {
    const isDriver = seat === -1;
    if (!isDriver) return;

    Speedometer.vehicle = vehicle;
    Speedometer.updaterIntervalId = setInterval(() => Speedometer.UpdateSpeedometer(), 250);

    mp.keys.bind(0x25, true, Speedometer.LeftTurn);
    mp.keys.bind(0x27, true, Speedometer.RightTurn);

    mp.events.call(LocalEvents.SpeedometerShow);
  }

  private static OnPlayerExitVehicle(): void {
    mp.events.call(LocalEvents.SpeedometerHide);
    clearInterval(Speedometer.updaterIntervalId);
    mp.keys.unbind(0x25, true, Speedometer.LeftTurn);
    mp.keys.unbind(0x27, true, Speedometer.RightTurn);

    if (Speedometer.isBlinking) {
      Speedometer.StopBlinking();
    }
  }

  private static StopBlinking(): void {
    clearInterval(Speedometer.blinkIntervalId);
    Speedometer.isBlinking = false;
    Speedometer.rightTurn = false;
    Speedometer.leftTurn = false;
    mp.players.local.vehicle.setIndicatorLights(1, false );
    mp.players.local.vehicle.setIndicatorLights(0, false );
  }

  private static LeftTurn(): void {
    if (Speedometer.isBlinking) {
      Speedometer.StopBlinking();
    } else {
      Speedometer.isBlinking = true;
      Speedometer.blinkIntervalId = setInterval(() => Speedometer.Blinking(true), 550);
    }
  }

  private static RightTurn(): void {
    if (Speedometer.isBlinking) {
      Speedometer.StopBlinking();
    } else {
      Speedometer.isBlinking = true;
      Speedometer.blinkIntervalId = setInterval(() => Speedometer.Blinking(false), 550);
    }
  }

  private static Blinking(IsLeft: boolean): void {
    if (IsLeft) {
      Speedometer.leftTurn = !Speedometer.leftTurn;
      mp.players.local.vehicle.setIndicatorLights(1, Speedometer.leftTurn );
    } else {
      Speedometer.rightTurn = !Speedometer.rightTurn;
      mp.players.local.vehicle.setIndicatorLights(0, Speedometer.rightTurn );
    }
  }

  private static UpdateSpeedometer(): void {
    const leftTurn = Speedometer.leftTurn;
    const rightTurn = Speedometer.rightTurn;

    const speed = Speedometer.vehicle.getSpeed();
    const lights = (Speedometer.vehicle as any).getLightsState(1, 1);
    const lowBeam: boolean = lights.lightsOn;
    const highBeam: boolean = lights.highbeamsOn;

    const locked = Speedometer.vehicle.getDoorLockStatus();

    const rawFuel = Speedometer.vehicle.getVariable('Fuel');
    const fuel = Number.parseFloat(rawFuel);

    const rawFuelTank = Speedometer.vehicle.getVariable('TankSize');
    const fuelTank = Number.parseFloat(rawFuelTank);

    mp.events.call(LocalEvents.SpeedometerUpdate, speed, leftTurn, lowBeam, highBeam, locked, rightTurn, fuel, fuelTank);
  }
};

Speedometer.Start();