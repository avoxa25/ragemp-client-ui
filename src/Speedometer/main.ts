import { LocalEvents } from '../Constants/localEvents';

abstract class Speedometer {
  private static vehicle: VehicleMp;
  private static updaterIntervalId: number;

  public static Start(): void {
    mp.browsers.new('package://Speedometer/speedometer.html');

    mp.events.add(RageEnums.EventKey.PLAYER_ENTER_VEHICLE, (v: VehicleMp, s: number) => Speedometer.OnPlayerEnterVehicle(v, s));
    mp.events.add(RageEnums.EventKey.PLAYER_LEAVE_VEHICLE, () => Speedometer.OnPlayerExitVehicle());
  }

  private static OnPlayerEnterVehicle(vehicle: VehicleMp, seat: number): void {
    const isDriver = seat !== 0;
    if (isDriver) return;

    Speedometer.vehicle = vehicle;
    Speedometer.updaterIntervalId = setInterval(() => Speedometer.UpdateSpeedometer(), 250);

    mp.events.call(LocalEvents.SpeedometerShow);
  }

  private static OnPlayerExitVehicle(): void {
    mp.events.call(LocalEvents.SpeedometerHide);
    clearInterval(Speedometer.updaterIntervalId);
  }

  private static UpdateSpeedometer(): void {
    // TODO: Implement leftTurn & rightTurn
    const leftTurn = false;
    const rightTurn = false;

    const speed = Speedometer.vehicle.getSpeed();
    const lights = Speedometer.vehicle.getLightsState(true, true);
    const locked = Speedometer.vehicle.getDoorLockStatus();

    const rawFuel = Speedometer.vehicle.getVariable('fuel');
    const fuel = Number.parseFloat(rawFuel);

    const rawFuelTank = Speedometer.vehicle.getVariable('fuelTank');
    const fuelTank = Number.parseFloat(rawFuelTank);

    mp.events.call(LocalEvents.SpeedometerUpdate, speed, leftTurn, lights.lightsOn, lights.highbeamsOn, locked, rightTurn, fuel, fuelTank);
  }
};

Speedometer.Start();