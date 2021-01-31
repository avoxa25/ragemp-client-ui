import { RemoteResponse } from '../../../constants/events/remote-response';
import { RemoteEvent } from '../../../constants/events/remote-event';
import { LocalEvent } from '../../../constants/events/local-event';
import { NotificationType } from '../../../constants/enums/notification-type';
import { KeyboardKeys } from '../../../constants/enums/keyboard-keys';
import { House } from '../../../models/houses/house';
import { Character } from '../../../models/characters/character';
import { CharacterService } from '../../../services/characters/character-service';
import { HouseService } from '../../../services/houses/house-service';

class HouseMenu {
  private readonly browser: BrowserMp;
  private readonly character: Character;

  private house: House | undefined;

  public constructor() {
    this.browser = mp.browsers.new('package://components/Menu/House/house.html');
    this.character = CharacterService.Get();

    mp.events.add(RemoteResponse.MenusHouseClose, () => this.HideHouseMenu());
    mp.events.add(RemoteResponse.MenusHouseReload, () => this.ReloadHouseMenu());

    mp.events.add(RageEnums.EventKey.PLAYER_ENTER_COLSHAPE, (cs: ColshapeMp) => this.PlayerEnterColShape(cs));
    mp.events.add(RageEnums.EventKey.PLAYER_EXIT_COLSHAPE, () => this.PlayerExitColShape());

    mp.events.add(LocalEvent.HouseBuy, () => this.HouseBuy());
    mp.events.add(LocalEvent.HouseEnterExit, () => this.HouseEnterExit());
    mp.events.add(LocalEvent.HouseSetLockState, (l: boolean) => this.HouseSetLockState(l));
    mp.events.add(LocalEvent.HouseSetOnSellState, (os: boolean, p: number) => this.HouseSetOnSellState(os, p));

    mp.events.add(LocalEvent.HouseMenuClose, () => this.HideHouseMenu());
    mp.events.add(LocalEvent.HouseMenuCursorVisible, (fc: boolean, v: boolean) => this.MenuCursorVisible(fc, v));
  }

  private PlayerEnterColShape(colShape: ColshapeMp): void {
    const houseColShape = (colShape as any).hasVariable('DummyEntity') && colShape.getVariable('DummyEntity') !== 'House';
    if (!houseColShape) return;

    const houseId = colShape.getVariable('Id') as number;
    this.house = HouseService.GetById(houseId);

    mp.events.call(RemoteResponse.NotificationSent, NotificationType.Info, 'Нажмите Е для открытия меню дома');
    mp.keys.bind(KeyboardKeys.KeyE, true, () => this.ShowHouseMenu());
  }

  private PlayerExitColShape(): void {
    mp.keys.unbind(KeyboardKeys.KeyE, true);
  }

  private ShowHouseMenu(): void {
    const isOwner = this.house?.ownerId === this.character.id;
    const haveOwner = this.house?.ownerId !== null;

    const houseJson = JSON.stringify(this.house);
    this.browser.execute(`window.houseMenuUi.ShowHouseMenu('${houseJson}', ${isOwner}, ${haveOwner});`);
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

  private HouseBuy(): void {
    mp.events.callRemote(RemoteEvent.HouseBuy, (this.house as House).id);
  }

  private HouseEnterExit(): void {
    mp.events.callRemote(RemoteEvent.HouseEnterExit, (this.house as House).id);
  }

  private HouseSetLockState(locked: boolean): void {
    mp.events.callRemote(RemoteEvent.HouseSetLockState, (this.house as House).id, locked);
  }

  private HouseSetOnSellState(onSale: boolean, price: number): void {
    mp.events.callRemote(RemoteEvent.HouseSetOnSellState, (this.house as House).id, onSale, price);
  }

  private MenuCursorVisible(freezeControls: boolean, visible: boolean): void {
    mp.gui.cursor.show(freezeControls, visible);
  }
}

let houseMenu: HouseMenu | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => houseMenu = houseMenu ? houseMenu : new HouseMenu());