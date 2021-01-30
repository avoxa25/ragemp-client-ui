export class CharacterSelectModel {
  public id: number;

  public firstName: string;
  public lastName: string;

  public cash: number;
  public bankMoney: number;

  public organization: string;

  // FIXME: Fix type of totalOnlineTime
  public totalOnlineTime: any;
  constructor() {
    this.id = 0;
    this.firstName = '';
    this.lastName = '';
    this.organization = '';
    this.cash = 0;
    this.bankMoney = 0;
    this.totalOnlineTime = '';
  }
}