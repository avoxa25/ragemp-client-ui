import { LocalEvents } from "../../Constants/local-events";
import { HouseModel } from "./house-model";

class HouseMenuUi {
  private readonly cashFormat = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });

  private readonly noOwnerContainer: HTMLElement;
  private readonly haveOwnerContainer: HTMLElement;
  private readonly manageHouse: HTMLElement;

  private houseModel: HouseModel;
  private isMenuOpened: boolean;
  private haveOwner: boolean;
  private isOwner: boolean;

  public constructor() {
    this.noOwnerContainer = document.querySelector('#homeInformationNoOwner') as HTMLElement;
    this.haveOwnerContainer = document.querySelector('#homeInformationHaveOwner') as HTMLElement;
    this.manageHouse = document.querySelector('#homeInformationIsOwner') as HTMLElement;

    this.houseModel = new HouseModel();
    this.haveOwner = false;
    this.isOwner = false;
    this.isMenuOpened = false;

    document.body.addEventListener('keydown', (e) => this.OnDocumentBodyKeydown(e));
  }

  public ShowHouseMenu(houseModelJson: string, isOwner: boolean, haveOwner: boolean): void {
    if (this.isMenuOpened) return;
    this.isMenuOpened = true;
    this.haveOwner = haveOwner;
    this.isOwner = isOwner;

    mp.events.call(LocalEvents.MenusHouseCursorVisible, true, true);

    this.houseModel = JSON.parse(houseModelJson);
    this.ApplyInformation();

    if (this.haveOwner) this.haveOwnerContainer.classList.remove('hide');
    else this.noOwnerContainer.classList.remove('hide');
  }

  public HideHouseMenu(): void {
    if (this.haveOwner) this.haveOwnerContainer.classList.add('hide');
    else this.noOwnerContainer.classList.add('hide');
  }

  private ChangeTabMenu(): void {
    if (this.haveOwnerContainer.classList.contains('hide')) {
      this.haveOwnerContainer.classList.remove('hide');
      this.manageHouse.classList.add('hide');
    } else {
      this.haveOwnerContainer.classList.add('hide');
      this.manageHouse.classList.remove('hide');
    }
  }

  private OnDocumentBodyKeydown(event: KeyboardEvent): void {
    const isMenuCloseKey = event.which === 81; // Q on keyboard
    if (this.isMenuOpened && isMenuCloseKey) {
      event.preventDefault();
      this.isMenuOpened = false;

      mp.events.call(LocalEvents.MenusHouseClose);
      mp.events.call(LocalEvents.MenusHouseCursorVisible, false, false);
    }
  }
  private ApplyInformation() {
    const housePrice = document.querySelectorAll('#homePrice') as NodeListOf<HTMLElement>;
    const houseClass = document.querySelectorAll('#homeClass') as NodeListOf<HTMLElement>;
    const houseGarageMaxValue = document.querySelectorAll('#homeGarageMaxValue') as NodeListOf<HTMLElement>;
    const houseStatus = document.querySelectorAll('#homeStatus') as NodeListOf<HTMLElement>;
    const houseLocation = document.querySelectorAll('#homeLocation') as NodeListOf<HTMLElement>;
    const manageButtons = document.querySelectorAll('button.manage') as NodeListOf<HTMLButtonElement>;
    const houseBuy = document.querySelectorAll('#homeBuy') as NodeListOf<HTMLButtonElement>;
    const houseEnter = document.querySelectorAll('#homeEnter') as NodeListOf<HTMLButtonElement>;
    const houseLock = document.querySelectorAll('#homeLock') as NodeListOf<HTMLButtonElement>;
    const houseSell = document.querySelectorAll('#homeSell') as NodeListOf<HTMLButtonElement>;

    housePrice.forEach((hp) => hp.innerText = this.cashFormat.format(this.houseModel.originalPrice));
    houseClass.forEach((hc) => hc.innerText = this.houseModel.type);
    // TODO: Create a tax for houses
    // TODO: Create a garage current capacity for houses
    houseGarageMaxValue.forEach((hgmv) => hgmv.innerText = this.houseModel.garageCapacity.toString());
    houseStatus.forEach((hs) => hs.innerText = this.houseModel.status);
    // TODO: Create house keys
    houseLocation.forEach((hl) => hl.innerText = this.houseModel.name);
    // TODO: Create tax paid for houses
    manageButtons.forEach((mb) => mb.addEventListener('click', () => this.ChangeTabMenu()));
    houseBuy.forEach((hb) => hb.addEventListener('click', () => this.BuyHouse()));
    houseEnter.forEach((he) => he.addEventListener('click', () => this.EnterHouse()));
    houseLock.forEach((hl) => hl.addEventListener('click', () => this.LockHouse()));
    houseSell.forEach((hs) => hs.addEventListener('click', () => this.SellHouse()));
  }

  private BuyHouse(): void {
    mp.events.call(LocalEvents.HouseBuy);
  }

  private EnterHouse(): void {
    mp.events.call(LocalEvents.HouseEnterExit);
  }

  private LockHouse(): void {
    mp.events.call(LocalEvents.HouseSetLockState, !this.houseModel.locked);
  }

  private SellHouse(): void {
    mp.events.call(LocalEvents.HouseSetOnSellState, !this.houseModel.onSale, this.houseModel.originalPrice);
  }
}

const houseMenuUi = new HouseMenuUi();
(window as any).houseMenuUi = houseMenuUi;