class CashAmmoUi {
  private readonly cashElement: HTMLElement;
  private readonly cashFormat: Intl.NumberFormat;

  private readonly ammoElement: HTMLElement;
  private readonly ammoClipElement: HTMLElement;
  private readonly ammoTotalElement: HTMLElement;

  public constructor() {
    this.cashElement = document.querySelector('#cash') as HTMLElement;
    this.cashFormat = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });

    this.ammoElement = document.querySelector('#ammo') as HTMLElement;
    this.ammoClipElement = document.querySelector('#ammoClip') as HTMLElement;
    this.ammoTotalElement = document.querySelector('#ammoTotal') as HTMLElement;
  }

  public UpdateCash(cash: number): void {
    const formattedCash = this.cashFormat.format(cash);
    this.cashElement.innerText = formattedCash;
  }

  public ShowAmmo(): void {
    this.ammoElement.hidden = false;
  }

  public HideAmmo(): void {
    this.ammoElement.hidden = true;
  }

  public SetAmmo(clip: number, total: number): void {
    this.ammoClipElement.innerText = clip.toString();
    this.ammoTotalElement.innerText = total.toString();
  }
}

const cashAmmoUi = new CashAmmoUi();
(window as any).CashAmmoUi = cashAmmoUi;