class HudLocationUi {
  public Hide(): void {
    document.body.hidden = true;
  }

  public Show(): void {
    document.body.hidden = false;
  }

  public Update(streetName: string, crossingRoad: string, zone: string): void {
    const streetNameElement = document.querySelector('#streetName') as HTMLElement;
    streetNameElement.innerText = streetName;

    const crossingRoadElement = document.querySelector('#crossingRoad') as HTMLElement;
    crossingRoadElement.innerText = crossingRoad;

    const zoneElement = document.querySelector('#zone') as HTMLElement;
    zoneElement.innerText = zone;
  }
};

const hudLocationUi = new HudLocationUi();
(window as any).hudLocationUi = hudLocationUi;