class CashAndAmmoUi {

  public HideAmmo(): void {
    const ammoElement = document.querySelector('#ammo') as HTMLElement;
    ammoElement.style.display = 'none';
  }

  public ShowAmmo(): void {
    const ammoElement = document.querySelector('#ammo') as HTMLElement;
    ammoElement.style.display = 'flex';
  }

  public UpdateCash(cash: number): void {
    const cashFormat = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(cash);

    const cashElement = document.querySelector('#cash') as HTMLElement;
    cashElement.innerText = cashFormat;
  }
}

const cashAndAmmoUi = new CashAndAmmoUi();
(window as any).cashAndAmmoUi = cashAndAmmoUi;