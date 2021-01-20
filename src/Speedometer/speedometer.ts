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
    locked: boolean,
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
    const speedometer = document.getElementById('current_speed') as HTMLElement;
    speedometer.innerText = speedInKmH.toString();
  }

  private UpdateLights(lowBeam: boolean, highBeam: boolean, leftTurn: boolean, rightTurn: boolean): void {
    const lowBeamElement = document.getElementById('lights') as HTMLElement;
    if (lowBeam) {
      lowBeamElement.classList.remove('nonActive');
    } else {
      lowBeamElement.classList.add('nonActive');
    }

    // TODO: Implement highBeam
    highBeam;

    const leftTurnElement = document.getElementById('arrow-left') as HTMLElement;
    if (leftTurn) {
      leftTurnElement.classList.remove('nonActive');
    } else {
      leftTurnElement.classList.add('nonActive');
    }

    const rightTurnElement = document.getElementById('arrowRight') as HTMLElement;
    if (rightTurn) {
      rightTurnElement.classList.remove('nonActive');
    } else {
      rightTurnElement.classList.add('nonActive');
    }
  }

  private UpdateLocked(locked: boolean): void {
    const lockedElement = document.getElementById('doorLock') as HTMLElement;
    if (locked) {
      lockedElement.classList.remove('nonActive');
    } else {
      lockedElement.classList.add('nonActive');
    }
  }

  private UpdateFuel(fuel: number, fuelTank: number): void {
    // TODO: Implement
    fuel; fuelTank;
  }
};

const speedometerUi = new SpeedometerUi();
speedometerUi.Hide();

(window as any).speedometerUi = speedometerUi;