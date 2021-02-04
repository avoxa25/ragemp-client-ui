import { BankCardType } from '../banks/bank-card-type';

export interface Character {
  id: number;
  accountId: number;

  bankAccountNumber: string;
  bankCardType: BankCardType | null;

  firstName: string;
  lastName: string;

  hunger: number;
  thirst: number;

  cash: number;

  createdAt: Date;
  totalOnlineTimeInHours: number;
}