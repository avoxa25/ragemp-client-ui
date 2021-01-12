import { LocalEvents } from '../Constants/localEvents';

abstract class Speedometer {
  public static Start(): void {
    mp.events.add(LocalEvents.SpeedometerShow, () => Speedometer.OnShow());
    mp.events.add(LocalEvents.SpeedometerHide, () => Speedometer.OnHide());
    mp.events.add(LocalEvents.SpeedometerUpdate, (speed: number, lightsOn: boolean, highbeamsOn: boolean, locked: number, fuel: number) => {
      Speedometer.UpdateSpeed(speed);
      Speedometer.UpdateLights(lightsOn, highbeamsOn);

      // TODO add fuel, lock
      fuel;
      locked;
    });
  }

  private static OnShow(): void {
    document.body.hidden = false;
  }

  private static OnHide(): void {
    document.body.hidden = true;
  }

  private static UpdateSpeed(speedInMpS: number): void {
    const speedInKmH = Math.ceil(speedInMpS * 3.6);
    const speedometer = document.getElementById('current_speed') as HTMLElement;
    speedometer.innerText = speedInKmH.toString();
  }

  private static UpdateLights(lightsOn: boolean, highbeamsOn: boolean): void {
    const lowBeam = document.getElementById('lights') as HTMLElement;
    if (lightsOn) {
      lowBeam.classList.remove('nonActive');
    } else {
      lowBeam.classList.add('nonActive');
    }

    // TODO: add highbeam
    highbeamsOn;
  }
  
};

Speedometer.Start();