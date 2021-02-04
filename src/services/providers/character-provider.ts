import { BehaviorSubject, iif, Observable, of, throwError } from 'rxjs';
import { concatMap, delay, map, retryWhen, tap } from 'rxjs/operators';
import { BankCardType } from '../../models/banks/bank-card-type';
import { RemoteResponse } from '../../constants/events/remote-response';
import { Character } from '../../models/characters/character';

class CharacterProvider {
  private readonly characterSubject: BehaviorSubject<Character>;

  constructor() {
    mp.events.add(RemoteResponse.CharacterMoneyChanged, () => this.UpdateSubject());
    mp.events.add(RemoteResponse.CharacterCreatorCreated, () => this.UpdateSubject());
    mp.events.add(RemoteResponse.CharacterSelected, () => this.UpdateSubject());

    this.characterSubject = new BehaviorSubject<Character>(undefined!);
  }

  public GetCurrent(): Observable<Character> {
    return this.characterSubject;
  }

  private UpdateSubject(): void {
    const character = this.GetDirectly();
    this.characterSubject.next(character);
  }

  private GetDirectly(): Character {
    const player = mp.players.local;

    const id = player.getVariable('Id') as number;
    const accountId = player.getVariable('AccountId') as number;

    const bankAccountNumber = player.getVariable('BankAccount') as string;
    const bankCardType = player.getVariable('BankCardType') as BankCardType | null;

    const firstName = player.getVariable('FirstName') as string;
    const lastName = player.getVariable('LastName') as string;

    const hunger = player.getVariable('Hunger') as number;
    const thirst = player.getVariable('Thirst') as number;

    const cash = player.getVariable('Cash') as number;

    const rawCreatedAt = player.getVariable('CreatedAt') as string;
    const createdAt = new Date(rawCreatedAt);

    const totalOnlineTimeInHours = player.getVariable('TotalOnlineTime') as number;

    const character: Character = {
      id: id,
      accountId: accountId,
      bankAccountNumber: bankAccountNumber,
      bankCardType: bankCardType,
      firstName: firstName,
      lastName: lastName,
      hunger: hunger,
      thirst: thirst,
      cash: cash,
      createdAt: createdAt,
      totalOnlineTimeInHours: totalOnlineTimeInHours
    };

    return character;
  }
}

export let GlobalCharacterProvider: CharacterProvider;
mp.events.add(RageEnums.EventKey.PLAYER_READY, () => GlobalCharacterProvider = GlobalCharacterProvider ? GlobalCharacterProvider : new CharacterProvider());