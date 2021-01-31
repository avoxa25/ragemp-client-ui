import { BankCardType } from '../../models/banks/bank-card-type';
import { Character } from '../../models/characters/character';

export abstract class CharacterProvider {
  public static Parse(player: PlayerMp) {
    const id = player.getVariable('Id') as number;
    const accountId = player.getVariable('AccountId') as number;

    const bankAccountNumber = player.getVariable('BankAccount') as string;
    const bankCardType = player.getVariable('BankCardType') as BankCardType;

    const firstName = player.getVariable('FirstName') as string;
    const lastName = player.getVariable('LastName') as string;

    const hunger = player.getVariable('Hunger') as number;
    const thirst = player.getVariable('Thirst') as number;

    const cash = player.getVariable('Cash') as number;

    const rawCreatedAt = player.getVariable('CreatedAt') as string;
    const createdAt = new Date(rawCreatedAt);

    const totalOnlineTimeInHours = player.getVariable('TotalOnlineTime') as number;

    const character = new Character(
      id, accountId,
      bankAccountNumber, bankCardType,
      firstName, lastName,
      hunger, thirst,
      cash,
      createdAt, totalOnlineTimeInHours);

    return character;
  }
}