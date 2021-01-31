import { BankCardType } from '../banks/bank-card-type';

export class Character {
  public id: number;
  public accountId: number;

  public bankAccountNumber: string;
  public bankCardType: BankCardType | undefined;

  public firstName: string;
  public lastName: string;

  public hunger: number;
  public thirst: number;

  public cash: number;

  public createdAt: Date;
  public totalOnlineTimeInHours: number;

  constructor(
    id: number, accountId: number,
    bankAccountNumber: string, bankCardType: BankCardType | undefined,
    firstName: string, lastName: string,
    hunger: number, thirst: number,
    cash: number,
    createdAt: Date, totalOnlineTimeInHours: number) {
    this.id = id;
    this.accountId = accountId;

    this.bankAccountNumber = bankAccountNumber;
    this.bankCardType = bankCardType;

    this.firstName = firstName;
    this.lastName = lastName;

    this.hunger = hunger;
    this.thirst = thirst;

    this.cash = cash;

    this.createdAt = createdAt;
    this.totalOnlineTimeInHours = totalOnlineTimeInHours;
  }
}