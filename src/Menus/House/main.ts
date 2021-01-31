import { RemoteResponse } from '../../Constants/remote-response';
import { PlayerEvents } from '../../Constants/player-events';
import { NotificationType } from '../../Constants/notification-type';
import { HouseModel } from './house-model';
import { HouseType } from './house-type';
import { KeyboardKeys } from '../../Constants/keyboard-keys';
import { LocalEvents } from '../../Constants/local-events';
import { RemoteEvents } from '../../Constants/remote-events';

class HouseMenu {
  private browser: BrowserMp;
  private readonly characterId: number;
  private houseModel: HouseModel;

  public constructor() {
    this.browser = mp.browsers.new('package://Menus/House/house.html');
    this.characterId = mp.players.local.getVariable('Id') as number;
    this.houseModel = new HouseModel();

    mp.events.add(RemoteResponse.MenusHouseClose, () => this.HideHouseMenu());
    mp.events.add(RemoteResponse.MenusHouseReload, () => this.ReloadHouseMenu());

    mp.events.add(PlayerEvents.EnteredColShape, (c: ColshapeMp) => this.PlayerEnterColShape(c));
    mp.events.add(PlayerEvents.ExitedColShape, () => this.PlayerExitColShape());

    mp.events.add(LocalEvents.HouseBuy, () => this.HouseBuy());
    mp.events.add(LocalEvents.HouseEnterExit, () => this.HouseEnterExit());
    mp.events.add(LocalEvents.HouseSetLockState, (l: boolean) => this.HouseSetLockState(l));
    mp.events.add(LocalEvents.HouseSetOnSellState, (os: boolean, p: number) => this.HouseSetOnSellState(os, p));

    mp.events.add(LocalEvents.MenusHouseClose, () => this.HideHouseMenu());
    mp.events.add(LocalEvents.MenusHouseCursorVisible, (fc: boolean, v: boolean) => this.MenuCursorVisible(fc, v));
  }

  private PlayerEnterColShape(colShape: ColshapeMp): void {
    if (colShape.getVariable('DummyEntity') === 'House') {
      mp.events.call(RemoteResponse.NotificationSent, NotificationType.Info, 'Нажмите Е для открытия меню Дома');
      mp.keys.bind(KeyboardKeys.KeyE, true, () => this.ShowHouseMenu(colShape));
    }
  }

  private PlayerExitColShape(): void {
    mp.keys.unbind(KeyboardKeys.KeyE, true);
  }

  private ShowHouseMenu(colShape: ColshapeMp): void {
    const ownerId = colShape.getVariable('OwnerId') as number | null;
    const locked = colShape.getVariable('Locked') as boolean;
    const onSale = colShape.getVariable('OnSale') as boolean;
    const isOwner = ownerId === this.characterId;
    const haveOwner = ownerId !== null;

    if (onSale) this.houseModel.status = 'На продаже';
    if (!onSale && locked) this.houseModel.status = 'Закрыт';
    if (!onSale && !locked) this.houseModel.status = 'Открыт';

    if (isOwner || isOwner && locked || onSale || !locked) {
      this.ColShapeToHouseModel(colShape);

      const houseModelJson = JSON.stringify(this.houseModel);
      this.browser.execute(`window.houseMenuUi.ShowHouseMenu('${houseModelJson}', ${isOwner}, ${haveOwner});`);
    }
  }

  private HideHouseMenu(): void {
    this.ReloadHouseMenu();
    this.MenuCursorVisible(false, false);
    this.browser.execute(`window.houseMenuUi.HideHouseMenu();`);
  }

  private ReloadHouseMenu(): void {
    this.browser.reload(false);
    this.MenuCursorVisible(false, false);
  }

  private ColShapeToHouseModel(colShape: ColshapeMp): void {
    const rawType = colShape.getVariable('Type') as number;
    switch (rawType) {
      case HouseType.Economy:
        this.houseModel.type = 'Эконом';
        break;
      case HouseType.EconomyPlus:
        this.houseModel.type = 'Эконом+';
        break;
      case HouseType.Budget:
        this.houseModel.type = 'Бюджет';
        break;
      case HouseType.BudgetPlus:
        this.houseModel.type = 'Бюджет+';
        break;
      case HouseType.Comfort:
        this.houseModel.type = 'Комфорт';
        break;
      case HouseType.ComfortPlus:
        this.houseModel.type = 'Комфорт+';
        break;
      case HouseType.Business:
        this.houseModel.type = 'Бизнес';
        break;
      case HouseType.BusinessPlus:
        this.houseModel.type = 'Бизнес+';
        break;
    }
    this.houseModel.id = colShape.getVariable('Id') as number;
    this.houseModel.ownerId = colShape.getVariable('OwnerId') as number | null;
    this.houseModel.name = colShape.getVariable('Name') as string;
    this.houseModel.garageCapacity = colShape.getVariable('GarageCapacity') as number;
    this.houseModel.locked = colShape.getVariable('Locked') as boolean;
    this.houseModel.onSale = colShape.getVariable('OnSale') as boolean;
    this.houseModel.originalPrice = colShape.getVariable('OriginalPrice') as number;
    this.houseModel.onSalePrice = colShape.getVariable('OnSalePrice') as number;
  }

  private HouseBuy(): void {
    mp.events.callRemote(RemoteEvents.HouseBuy, this.houseModel.id);
  }

  private HouseEnterExit(): void {
    mp.events.callRemote(RemoteEvents.HouseEnterExit, this.houseModel.id);
  }

  private HouseSetLockState(locked: boolean): void {
    mp.events.callRemote(RemoteEvents.HouseSetLockState, this.houseModel.id, locked);
  }

  private HouseSetOnSellState(onSale: boolean, price: number): void {
    mp.events.callRemote(RemoteEvents.HouseSetOnSellState, this.houseModel.id, onSale, price);
  }

  private MenuCursorVisible(freezeControls: boolean, visible: boolean): void {
    mp.gui.cursor.show(freezeControls, visible);
  }
}


let houseMenu: HouseMenu | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => houseMenu = houseMenu ? houseMenu : new HouseMenu());