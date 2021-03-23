class GasPumpUi {
  private readonly cashFormat: Intl.NumberFormat;

  private readonly oilPriceTag: HTMLElement;
  private readonly powerPriceTag: HTMLElement;
  private readonly canisterPriceTag: HTMLElement;
  private readonly repairKitPriceTag: HTMLElement;

  private readonly inputProductAmount: HTMLInputElement;

  private readonly fuelValueTag: HTMLElement;
  private readonly maxFuelValueTag: HTMLElement;  

  private oilPrice: number;
  private powerPrice: number;
  private canisterPrice: number;
  private repairKitPrice: number;

  private fuel: number;
  private maxFuel: number;
  private fuelDifference: number;

  constructor() {
    this.cashFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

    this.oilPriceTag = document.querySelector('#oilPrice') as HTMLElement;
    this.powerPriceTag = document.querySelector('#powerPrice') as HTMLElement;
    this.canisterPriceTag = document.querySelector('#canisterPrice') as HTMLElement;
    this.repairKitPriceTag = document.querySelector('#repairKitPrice') as HTMLElement;
    
    this.inputProductAmount = document.querySelector('#inputProductAmount') as HTMLInputElement;

    this.fuelValueTag = document.querySelector('#currentFuelValue') as HTMLElement;
    this.maxFuelValueTag = document.querySelector('#maxFuelValue') as HTMLElement;

    this.oilPrice = 0;
    this.powerPrice = 0;
    this.canisterPrice = 0;
    this.repairKitPrice = 0;

    this.fuel = 0;
    this.maxFuel = 0;
    this.fuelDifference = 0;

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

  public Show(): void {
    window.document.body.hidden = false;
  }

  public Hide(): void {
    window.document.body.hidden = true;
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

  public UpdateFuelTank(fuel: number, maxFuel: number): void {
    this.fuel = fuel;
    this.maxFuel = maxFuel;
    this.fuelDifference = this.maxFuel - this.fuel;

    this.fuelValueTag.innerText = fuel.toString();
    this.maxFuelValueTag.innerText = maxFuel.toString();
  }

  private ChangeProduct(button: HTMLElement, buttons: NodeListOf<HTMLElement>): void {
    buttons.forEach((b) => b === button ? button.classList.add('active') : b.classList.remove('active'));
    this.CalculateTotalCost();
  }

  private Pay(button: HTMLButtonElement): void {
    const paymentMethod = button.getAttribute('data-method');
    switch (paymentMethod) {
      case 'cash':
        // TODO: Payment cash
        break;
      case 'bank':
        // TODO: Payment bank
        break;
      default:
        throw 'Invalid payment method';
    }
  }

  private FillFull(): void {
    this.inputProductAmount.value = this.fuelDifference.toString();

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

    if (productAmount > this.fuelDifference) {
      productAmount = this.fuelDifference;
      this.inputProductAmount.value = this.fuelDifference.toString();
    }

    let productPrice: number;
    const productType = activeProduct.getAttribute('data-product');
    switch (productType) {
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

const gasPumpUi = new GasPumpUi();
(window as any).gasPumpUi = gasPumpUi;