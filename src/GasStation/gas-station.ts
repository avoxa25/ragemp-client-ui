class GasStationUi {
  private readonly cashFormat = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });

  private readonly oilPriceTag = document.querySelector('#oilPrice') as HTMLElement;
  private readonly powerPriceTag = document.querySelector('#powerPrice') as HTMLElement;
  private readonly canisterPriceTag = document.querySelector('#canisterPrice') as HTMLElement;
  private readonly repairKitPriceTag = document.querySelector('#repairKitPrice') as HTMLElement;
  private readonly currentFuelValueTag = document.querySelector('#currentFuelValue') as HTMLElement;
  private readonly maxFuelValueTag = document.querySelector('#maxFuelValue') as HTMLElement;
  private readonly inputProductAmount = document.querySelector('#inputProductAmount') as HTMLInputElement;

  private oilPrice: number;
  private powerPrice: number;
  private canisterPrice: number;
  private repairKitPrice: number;
  private currentFuelValue: number;
  private maxFuelValue: number;
  private differenceFuelValue: number;

  constructor() {
    this.oilPrice = 0;
    this.powerPrice = 0;
    this.canisterPrice = 0;
    this.repairKitPrice = 0;
    this.currentFuelValue = 0;
    this.maxFuelValue = 0;
    this.differenceFuelValue = 0;

    const buttonsProduct = document.querySelectorAll('#product') as NodeListOf<HTMLButtonElement>;
    buttonsProduct.forEach((button) => button.addEventListener('click', () => this.ChangeProduct(button, buttonsProduct)));
    const buttonsPayMethod = document.querySelectorAll('#paymentMethod') as NodeListOf<HTMLButtonElement>;
    buttonsPayMethod.forEach((button) => button.addEventListener('click', () => this.Pay(button)));
    const buttonFillFull = document.querySelector('#fillFullFuelTank') as HTMLButtonElement;
    buttonFillFull.addEventListener('click', () => this.FillFull());
    const buttonOperation = document.querySelectorAll('.refill-count>button') as NodeListOf<HTMLButtonElement>;
    buttonOperation.forEach((button) => button.addEventListener('click', () => this.doArithmeticOperation(button)));
    this.inputProductAmount.addEventListener('input', () => this.CalculateTotalCost());
  }

  public UpdatePrices(oilPrice: number, powerPrice: number, canisterPrice: number, repairKitPrice: number): void {
    this.oilPrice = oilPrice;
    this.powerPrice = powerPrice;
    this.canisterPrice = canisterPrice;
    this.repairKitPrice = repairKitPrice;

    this.oilPriceTag.innerText = this.cashFormat.format(this.oilPrice);
    this.powerPriceTag.innerText = this.cashFormat.format(this.powerPrice);
    this.canisterPriceTag.innerText = this.cashFormat.format(this.canisterPrice);
    this.repairKitPriceTag.innerText = this.cashFormat.format(this.repairKitPrice);
  }

  public UpdateFuelTankInformation(currentFuelValue: number, maxFuelValue: number): void {
    this.currentFuelValueTag.innerText = currentFuelValue.toString();
    this.maxFuelValueTag.innerText = maxFuelValue.toString();

    this.currentFuelValue = currentFuelValue;
    this.maxFuelValue = maxFuelValue;
    this.differenceFuelValue = this.maxFuelValue - this.currentFuelValue;
  }

  private ChangeProduct(button: HTMLElement, buttons: NodeListOf<HTMLElement>): void {
    buttons.forEach((b) => b === button ? button.classList.add('active') : b.classList.remove('active'));
    this.CalculateTotalCost();
  }

  private Pay(button: HTMLButtonElement): void {
    switch (button.getAttribute('data-method')) {
      case 'cash':
        //TODO: Payment cash
        break;
      case 'bank':
        //TODO: Payment bank
        break;
      default:
        throw 'Invalid payment method'
    }
  }

  private FillFull(): void {
    this.inputProductAmount.value = this.differenceFuelValue.toString();

    this.CalculateTotalCost();
  }

  private doArithmeticOperation(button: HTMLButtonElement): void {
    let currentProductAmount = Number.parseInt(this.inputProductAmount.value);
    button.getAttribute('data-operation') === 'plus' ? currentProductAmount += 5 : currentProductAmount -= 5;
    this.inputProductAmount.value = currentProductAmount.toString();
    this.CalculateTotalCost();
  }

  private CalculateTotalCost(): void {
    const totalCost = document.querySelector('#totalCost') as HTMLElement;
    const activeProduct = document.querySelector('#product.active') as HTMLElement;
    let productAmount = Number.parseInt(this.inputProductAmount.value);

    if (productAmount < 0 || this.inputProductAmount.value === null) {
      productAmount = 0
      this.inputProductAmount.value = '0';
    }

    if (productAmount > this.differenceFuelValue) {
      productAmount = this.differenceFuelValue;
      this.inputProductAmount.value = this.differenceFuelValue.toString();
    }

    let productPrice;
    switch (activeProduct.getAttribute('data-product')) {
      case 'oil':
        productPrice = this.oilPrice;
        break;
      case 'repair-kit':
        productPrice = this.repairKitPrice;
        break;
      case 'canister':
        productPrice = this.canisterPrice;
        break;
      case 'power':
        productPrice = this.powerPrice;
        break;
      default:
        throw 'Invalid product type';
    }

    let totalPrice = productAmount * productPrice;
    totalCost.innerText = this.cashFormat.format(totalPrice);
  }

};

(window as any).gasStationUi = new GasStationUi;
