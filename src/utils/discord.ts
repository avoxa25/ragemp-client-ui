import { LocalEvent } from '../models/enums/events/local-event';
import { RemoteResponse } from '../models/enums/events/remote-response';

class Discord {
  private readonly title: string;

  constructor() {
    this.title = 'SweetLifeRP';

    mp.events.add(RemoteResponse.LoginAllowed, () => mp.discord.update(this.title, 'Авторизовывается'));
    mp.events.add(RemoteResponse.LoginSuccess, () => mp.discord.update(this.title, 'Выбирает персонажа'));
    mp.events.add(LocalEvent.CharacterCreatorOpen, () => mp.discord.update(this.title, 'Создаёт персонажа'));
    mp.events.add(RemoteResponse.CharacterSelected, () => mp.discord.update(this.title, 'Выбирает точку появления'));
    mp.events.add(RemoteResponse.CharacterSpawnSelected, () => mp.discord.update(this.title, 'Гуляет пешком'));

    mp.events.add(RageEnums.EventKey.PLAYER_ENTER_VEHICLE, () => mp.discord.update(this.title, 'Едет в транспорте'));
    mp.events.add(RageEnums.EventKey.PLAYER_LEAVE_VEHICLE, () => mp.discord.update(this.title, 'Гуляет пешком'));

    mp.discord.update(this.title, 'Входит на сервер');
  }
}

const discord = new Discord();