import { House } from '../../../models/houses/house';
import { LocalEvent } from '../../../constants/events/local-event';
import { HouseType } from '../../../models/houses/house-type';
import { KeyboardAsciiKeys } from '../../../constants/enums/keyboard-ascii-keys';

class HouseMenuUi {
  private readonly cashFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

  private readonly noOwnerContainer: HTMLElement;
  private readonly haveOwnerContainer: HTMLElement;
  private readonly manageHouse: HTMLElement;

  private house: House | undefined;
  private isMenuOpened: boolean;
  private haveOwner: boolean;
  private isOwner: boolean;

  public constructor() {
    this.noOwnerContainer = document.querySelector('#homeInformationNoOwner') as HTMLElement;
    this.haveOwnerContainer = document.querySelector('#homeInformationHaveOwner') as HTMLElement;
    this.manageHouse = document.querySelector('#homeInformationIsOwner') as HTMLElement;

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

    this.house = JSON.parse(houseModelJson);
    mp.events.call(LocalEvent.CursorVisible, true, true);

    this.UpdateHouseInfo();

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
    const isMenuCloseKey = event.which === KeyboardAsciiKeys.Esc;
    if (this.isMenuOpened && isMenuCloseKey) {
      event.preventDefault();
      this.isMenuOpened = false;

      mp.events.call(LocalEvent.HouseMenuClose);
      mp.events.call(LocalEvent.CursorVisible, false, false);
    }
  }
  private UpdateHouseInfo() {
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

    housePrice.forEach((hp) => hp.innerText = this.cashFormat.format((this.house as House).originalPrice as number));

    let houseTypeText: string;
    switch (this.house?.type) {
      case HouseType.Economy:
        houseTypeText = 'Эконом';
        break;
      case HouseType.EconomyPlus:
        houseTypeText = 'Эконом+';
        break;
      case HouseType.Budget:
        houseTypeText = 'Бюджет';
        break;
      case HouseType.BudgetPlus:
        houseTypeText = 'Бюджет+';
        break;
      case HouseType.Comfort:
        houseTypeText = 'Комфорт';
        break;
      case HouseType.ComfortPlus:
        houseTypeText = 'Комфорт+';
        break;
      case HouseType.Business:
        houseTypeText = 'Бизнес';
        break;
      case HouseType.BusinessPlus:
        houseTypeText = 'Бизнес+';
        break;
      default:
        houseTypeText = 'Неизвестно';
        break;
    }
    houseClass.forEach((hc) => hc.innerText = houseTypeText);

    houseGarageMaxValue.forEach((hgmv) => hgmv.innerText = (this.house as House).garageCapacity?.toString() as string);

    let statusText: string;
    if (this.house?.onSale) statusText = 'На продаже';
    if (!this.house?.onSale && this.house?.locked) statusText = 'Закрыт';
    if (!this.house?.onSale && !this.house?.locked) statusText = 'Открыт';
    houseStatus.forEach((hs) => hs.innerText = statusText);

    houseLocation.forEach((hl) => hl.innerText = (this.house as House).name as string);

    manageButtons.forEach((mb) => mb.addEventListener('click', () => this.ChangeTabMenu()));
    houseBuy.forEach((hb) => hb.addEventListener('click', () => this.BuyHouse()));
    houseEnter.forEach((he) => he.addEventListener('click', () => this.EnterHouse()));
    houseLock.forEach((hl) => hl.addEventListener('click', () => this.LockHouse(!this.house?.locked)));
    houseSell.forEach((hs) => hs.addEventListener('click', () => this.SellHouse(!this.house?.onSale, this.house?.onSalePrice)));

    // TODO: Create a tax for houses
    // TODO: Create a garage current capacity for houses
    // TODO: Create tax paid for houses
    // TODO: Create house keys
  }

  private BuyHouse(): void {
    mp.events.call(LocalEvent.HouseBuy);
  }

  private EnterHouse(): void {
    mp.events.call(LocalEvent.HouseEnterExit);
  }

  private LockHouse(locked: boolean | undefined): void {
    mp.events.call(LocalEvent.HouseSetLockState, locked);
  }

  private SellHouse(onSale: boolean | undefined, onSalePrice: number | undefined): void {
    mp.events.call(LocalEvent.HouseSetOnSellState, onSale, onSalePrice);
  }
}

const houseMenuUi = new HouseMenuUi();
(window as any).houseMenuUi = houseMenuUi;