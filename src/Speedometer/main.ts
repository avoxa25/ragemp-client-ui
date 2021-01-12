import { LocalEvents } from '../Constants/localEvents';

mp.browsers.new('package://Speedometer/speedometer.html');

let speedometerUpdaterIntervalId: number;

mp.events.add(RageEnums.EventKey.PLAYER_ENTER_VEHICLE, (vehicle: VehicleMp, seat: number) => {
  const isDriver = seat !== 0;
  if (isDriver) return;

  mp.events.call(LocalEvents.SpeedometerShow);

  speedometerUpdaterIntervalId = setInterval(() => {
    const speed = vehicle.getSpeed();
    const lights = vehicle.getLightsState(true, true);
    const fuel = Number.parseFloat(vehicle.getVariable('fuel'));
    const locked = vehicle.getDoorLockStatus();
    mp.events.call(LocalEvents.SpeedometerUpdate, speed, lights.lightsOn, lights.highbeamsOn, locked, fuel)
  }, 250);
});

mp.events.add(RageEnums.EventKey.PLAYER_LEAVE_VEHICLE, () => {
  mp.events.call(LocalEvents.SpeedometerHide);
  clearInterval(speedometerUpdaterIntervalId);
});