class SpeedometerUi {
  public Show(): void {
    document.body.hidden = false;
  }

  public Hide(): void {
    document.body.hidden = true;
  }

  public Update(
    speed: number,
    leftTurn: boolean,
    lowBeam: boolean,
    highBeam: boolean,
    locked: number,
    rightTurn: boolean,
    fuel: number,
    fuelTank: number) {
    this.UpdateSpeed(speed);
    this.UpdateLights(lowBeam, highBeam, leftTurn, rightTurn);
    this.UpdateLocked(locked);
    this.UpdateFuel(fuel, fuelTank);
  }

  private UpdateSpeed(speedInMpS: number): void {
    const speedInKmH = Math.ceil(speedInMpS * 3.6);
    const speedometer = document.querySelector('#currentSpeed') as HTMLElement;
    speedometer.innerText = speedInKmH.toString();
  }

  private UpdateLights(lowBeam: boolean, highBeam: boolean, leftTurn: boolean, rightTurn: boolean): void {
    const lowBeamElement = document.querySelector('#lights') as HTMLElement;
    if (lowBeam) {
      lowBeamElement.classList.remove('nonActive');
    } else {
      lowBeamElement.classList.add('nonActive');
    }

    // TODO: Implement highBeam
    highBeam;

    const leftTurnElement = document.querySelector('#arrowLeft') as HTMLElement;
    if (leftTurn) {
      leftTurnElement.classList.remove('nonActive');
    } else {
      leftTurnElement.classList.add('nonActive');
    }

    const rightTurnElement = document.querySelector('#arrowRight') as HTMLElement;
    if (rightTurn) {
      rightTurnElement.classList.remove('nonActive');
    } else {
      rightTurnElement.classList.add('nonActive');
    }
  }

  private UpdateLocked(locked: number): void {
    const lockedElement = document.querySelector('#lock') as HTMLElement;
    if (locked == 1) {
      lockedElement.classList.remove('nonActive');
    } else {
      lockedElement.classList.add('nonActive');
    }
  }

  private UpdateFuel(fuel: number, fuelTank: number): void {
    const fuelElement = document.querySelector('#fuelValue') as HTMLElement;
    const percentage = Math.round((fuel / fuelTank) * 100);
    fuelElement.style.backgroundPosition = `${100 - percentage}% 50%`
  }
};

const speedometerUi = new SpeedometerUi();
(window as any).speedometerUi = speedometerUi;