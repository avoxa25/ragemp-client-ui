import { LocalEvents } from '../Constants/localEvents';

abstract class SpeedometerUi {
  public static Start(): void {
    mp.events.add(LocalEvents.SpeedometerShow, () => SpeedometerUi.OnShow());
    mp.events.add(LocalEvents.SpeedometerHide, () => SpeedometerUi.OnHide());
    mp.events.add(
      LocalEvents.SpeedometerUpdate,
      (s: number, lt: boolean, lb: boolean, hb: boolean, l: boolean, rt: boolean, f: number, ft: number) => SpeedometerUi.Update(s, lt, lb, hb, l, rt, f, ft));
  }

  private static OnShow(): void {
    document.body.hidden = false;
  }

  private static OnHide(): void {
    document.body.hidden = true;
  }

  private static Update(
    speed: number,
    leftTurn: boolean,
    lowBeam: boolean,
    highBeam: boolean,
    locked: boolean,
    rightTurn: boolean,
    fuel: number,
    fuelTank: number) {
    SpeedometerUi.UpdateSpeed(speed);
    SpeedometerUi.UpdateLights(lowBeam, highBeam);

    // TODO: Implement leftTurn, rightTurn, locked, fuel, fuelTank
    leftTurn; rightTurn;
    locked;
    fuel; fuelTank;
  }

  private static UpdateSpeed(speedInMpS: number): void {
    const speedInKmH = Math.ceil(speedInMpS * 3.6);
    const SpeedometerUi = document.getElementById('current_speed') as HTMLElement;
    SpeedometerUi.innerText = speedInKmH.toString();
  }

  private static UpdateLights(lowBeam: boolean, highBeam: boolean): void {
    const lowBeamElement = document.getElementById('lights') as HTMLElement;
    if (lowBeam) {
      lowBeamElement.classList.remove('nonActive');
    } else {
      lowBeamElement.classList.add('nonActive');
    }

    // TODO: Implement highBeam
    highBeam;
  }

};

SpeedometerUi.Start();