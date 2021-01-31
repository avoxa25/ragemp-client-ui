class HomeMenuUI {
  private readonly cashFormat = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });

  private readonly noOwnerContainer = document.querySelector('#homeInformationNoOwner') as HTMLElement;
  private readonly haveOwnerContainer = document.querySelector('#homeInformationHaveOwner') as HTMLElement;
  private readonly isOwnerContainer = document.querySelector('#homeInformationIsOwner') as HTMLElement;

  private haveOwner: boolean;
  private home: Object;
  private owner: PlayerMp | null;
  private isOwner: boolean;



  constructor(haveOwner: boolean, home: Object, owner: PlayerMp | null) {
    this.haveOwner = haveOwner;
    this.home = home;
    this.owner = owner;
    this.isOwner = home.owner !== null && owner !== null ? home.owner.id === this.owner.id : false;

    this.ApplyInformation();
    this.Render();
  }

  private ApplyInformation() {
    const homePrice = document.querySelectorAll('#homePrice') as NodeListOf<HTMLElement>;
    const homeClass = document.querySelectorAll('#homeClass') as NodeListOf<HTMLElement>;
    const homeTax = document.querySelectorAll('#homeTax') as NodeListOf<HTMLElement>;
    const homeGarageCurrentValue = document.querySelectorAll('#homeGarageCurrentValue') as NodeListOf<HTMLElement>;
    const homeGarageMaxValue = document.querySelectorAll('#homeGarageMaxValue') as NodeListOf<HTMLElement>;
    const homeStatus = document.querySelectorAll('#homeStatus') as NodeListOf<HTMLElement>;
    const homeKeysCurrentValue = document.querySelectorAll('#homeKeysCurrentValue') as NodeListOf<HTMLElement>;
    const homeKeysMaxValue = document.querySelectorAll('#homeKeysMaxValue') as NodeListOf<HTMLElement>;
    const homeLocation = document.querySelectorAll('#homeLocation') as NodeListOf<HTMLElement>;
    const homeTaxPaidBefore = document.querySelectorAll('#homeTaxPaidBefore') as NodeListOf<HTMLElement>;
    const homeBuy = document.querySelectorAll('#homeBuy') as NodeListOf<HTMLButtonElement>;
    const homeEnter = document.querySelectorAll('#homeEnter') as NodeListOf<HTMLButtonElement>;

    homePrice.forEach((hp) => hp.innerText = this.cashFormat.format(this.home.homePrice));
    homeClass.forEach((hc) => hc.innerText = this.home.homeClass);
    homeTax.forEach((ht) => ht.innerText = this.cashFormat.format(this.home.homeTax));
    homeGarageCurrentValue.forEach((hgcv) => hgcv.innerText = this.home.homeGarageCurrentValue.toString());
    homeGarageMaxValue.forEach((hgmv) => hgmv.innerText = this.home.homeGarageMaxValue.toString());
    homeStatus.forEach((hs) => hs.innerText = this.home.homeStatus);
    homeKeysCurrentValue.forEach((hkcv) => hkcv.innerText = this.home.homeKeysCurrentValue.toString());
    homeKeysMaxValue.forEach((hkmv) => hkmv.innerText = this.home.homeKeysMaxValue.toString());
    homeLocation.forEach((hl) => hl.innerText = this.home.homeLocation);
    homeTaxPaidBefore.forEach((htpb) => htpb.innerText = this.home.homeTaxPaidBefore.toString());
    homeBuy.forEach((hb) => hb.addEventListener('click', () => this.Buy()));
    homeEnter.forEach((he) => he.addEventListener('click', () => this.Enter()));
  }

  private Render(): void {
    if (this.haveOwner) {
      this.isOwner ? this.isOwnerContainer.classList.remove('hide') : this.haveOwnerContainer.classList.remove('hide');
    } else {
      this.noOwnerContainer.classList.remove('hide');
    }
  }

  public Buy(): boolean {
    //TODO: Buy feature
    return true;
  }

  public Enter(): void {
    //TODO: enter feature
  }
}

(window as any).homeMenuUi = new HomeMenuUI(false, Object, null);