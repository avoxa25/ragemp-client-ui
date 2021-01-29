export class CharacterSelectModel {
  public id: number;

  public firstName: string;
  public lastName: string;

  public faction: string;

  public cash: number;
  public bankCash: number;

  // FIXME: Fix type of totalOnlineTime
  public totalOnlineTime: string;
  constructor() {
    this.id = 0;
    this.firstName = '';
    this.lastName = '';
    this.faction = '';
    this.cash = 0;
    this.bankCash = 0;
    this.totalOnlineTime = '';
  }
}