import { RemoteResponse } from '../../constants/events/remote-response';
import { Character } from '../../models/characters/character';
import { CharacterProvider } from './character-provider';

export abstract class CharacterService {
  private static player: Character;

  public static Start(): void {
    const player = CharacterProvider.Parse(mp.players.local);
    CharacterService.player = player;

    mp.events.add(RemoteResponse.CharacterMoneyChanged, () => this.UpdateMoney());
  }

  public static Get(): Character {
    return CharacterService.player;
  }

  private static UpdateMoney(): void {
    const cash = mp.players.local.getVariable('Cash') as number;
    CharacterService.player.cash = cash;
  }
}

mp.events.add(RemoteResponse.CharacterCreatorCreated, () => CharacterService.Start());
mp.events.add(RemoteResponse.CharacterSelected, () => CharacterService.Start());