class HudLocationUi {
  public Hide(): void {
    document.body.hidden = true;
  }

  public Show(): void {
    document.body.hidden = false;
  }

  public Update(streetName: string, crossingRoad: string): void {
    const streetNameElement = document.querySelector('#streetName') as HTMLElement;
    streetNameElement.innerText = streetName;

    const crossingRoadElement = document.querySelector('#crossingRoad') as HTMLElement;
    crossingRoadElement.innerText = crossingRoad;
  }
};

const hudLocationUi = new HudLocationUi();
(window as any).hudLocationUi = hudLocationUi;