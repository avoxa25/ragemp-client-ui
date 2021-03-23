class BankCard {
  public type: number;
  public typeClassName: string
  public typeName: string;
  public cost: number;
  public privilege: string;
  public number: string;
  public maxСonsumption: number;

  constructor(type: number | string) {
    if (typeof type === 'string') type = this.DefineTypeByString(type) as number;
    this.type = type;
    this.typeClassName = this.DefineTypeClassName(this.type);
    this.typeName = this.DefineTypeName(this.type);
    this.cost = this.DefineCost(this.type);
    this.privilege = this.DefinePrivilege(this.type);
    this.number = this.DefineNumber();
    this.maxСonsumption = this.DefineMaxСonsumption(this.type);
  }

  public ChangeCardType(type: number | string) {
    if (typeof type === 'string') type = this.DefineTypeByString(type) as number;
    this.type = type;
    this.typeClassName = this.DefineTypeClassName(this.type);
    this.typeName = this.DefineTypeName(this.type);
    this.cost = this.DefineCost(this.type);
    this.privilege = this.DefinePrivilege(this.type);
    this.number = this.DefineNumber();
    this.maxСonsumption = this.DefineMaxСonsumption(this.type);
  }

  public DefineTypeByString(type: string): number {
    let typeNumber: number;

    switch (type) {
      case 'classic':
        typeNumber = 1;
        break;
      case 'silver':
        typeNumber = 2;
        break;
      case 'gold':
        typeNumber = 3;
        break;
      case 'platinum':
        typeNumber = 4;
        break;
      default:
        throw 'Invalid card bank type'
    }

    return typeNumber;
  }

  public DefineTypeClassName(type: number): string {
    let className: string;

    switch (type) {
      case 1:
        className = 'classic';
        break;
      case 2:
        className = 'silver';
        break;
      case 3:
        className = 'gold';
        break;
      case 4:
        className = 'platinum';
        break;
      default:
        throw 'Invalid card bank type'
    }

    return className;
  }

  public DefineTypeName(type: number): string {
    let typeName: string;

    switch (type) {
      case 1:
        typeName = 'КЛАССИЧЕСКАЯ';
        break;
      case 2:
        typeName = 'СЕРЕБРЯНАЯ';
        break;
      case 3:
        typeName = 'ЗОЛОТАЯ';
        break;
      case 4:
        typeName = 'ПЛАТИНОВАЯ';
        break;
      default:
        throw 'Invalid card bank type'
    }

    return typeName;
  }

  public DefineCost(type: number): number {
    let cost: number;

    switch (type) {
      case 1:
        cost = 0;
        break;
      case 2:
        cost = 5000;
        break;
      case 3:
        cost = 25000;
        break;
      case 4:
        cost = 50000;
        break;
      default:
        throw 'Invalid card bank type'
    }

    return cost;
  }

  public DefinePrivilege(type: number): string {
    let privilege: string;

    switch (type) {
      case 1:
        privilege = '';
        break;
      case 2:
        privilege = '';
        break;
      case 3:
        privilege = 'VIP';
        break;
      case 4:
        privilege = 'PREMIUM';
        break;
      default:
        throw 'Invalid card bank type'
    }

    return privilege;
  }

  public DefineNumber(): string {
    let number = '';

    for (let i = 0; i <= 4; i++) number += (1000 + Math.random() * (9999 - 1000)).toString();

    if (true) {
      //TODO: comparison by the number of existing cards
    }

    return number;
  }

  public ConvertCardNumber(number: string): string {
    const splitedNumbers = number.replace(/(\d{4})/g, '$1,').split(',') as Array<string>;
    let convertedCardNumber = '';

    splitedNumbers.forEach((sn) => convertedCardNumber += sn + '&nbsp;');

    return convertedCardNumber;
  }

  public DefineMaxСonsumption(type: number): number {
    let consumption: number;

    switch (type) {
      case 1:
        consumption = 50000;
        break;
      case 2:
        consumption = 100000;
        break;
      case 3:
        consumption = 250000;
        break;
      case 4:
        consumption = 500000;
        break;
      default:
        throw 'Invalid card bank type'
    }

    return consumption;
  }
}
