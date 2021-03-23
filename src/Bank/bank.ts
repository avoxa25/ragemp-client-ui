class BankMenuUi {
  private readonly cashFormat = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });
  private readonly cardIssueTag = document.querySelector('#cardIssue') as HTMLElement;
  private readonly cardSelectionTag = document.querySelector('#cardIssue') as HTMLElement;
  private readonly cardMenuTag = document.querySelector('#cardMenu') as HTMLElement;
  private readonly cardSelectorTypeTag = document.querySelector('.card-selection #cardType') as HTMLElement;
  private readonly cardSelectorTypeTextTag = document.querySelector('.card-selection #cardTypeText') as HTMLElement;
  private readonly cardSelectorNumberTag = document.querySelector('.card-selection #cardNumber') as HTMLElement;
  private readonly cardSelectorCostTag = document.querySelector('.card-selection #cardCost') as HTMLElement;
  private readonly cardSelectorPrivilegeTag = document.querySelector('.card-selection #cardPrivilege') as HTMLElement;
  private player: any;
  private tempCard: BankCard;


  public constructor(player: any) {
    this.player = player;

    const isPlayerHaveCard = (this.player.bankCard !== null) as boolean;
    if (isPlayerHaveCard) {
      this.ApplyInformation();
      this.tempCard = player.bankCard as BankCard;
    } else {
      this.Render(isPlayerHaveCard);
      this.tempCard = new BankCard(1);
    }

    const buttonCardIssueAccept = document.querySelector('#cardIssue #accept') as HTMLButtonElement;
    buttonCardIssueAccept.addEventListener('click', () => {

      this.AddCardInformation(this.tempCard);

      this.cardIssueTag.classList.add('hide');
      this.cardSelectionTag.classList.remove('hide');
    });

    const buttonCardIssueDecline = document.querySelector('#cardIssue #decline') as HTMLButtonElement;
    buttonCardIssueDecline.addEventListener('click', () => this.cardIssueTag.classList.add('hide'));
    const buttonsCardChange = document.querySelectorAll('#cardChange') as NodeListOf<HTMLButtonElement>;
    buttonsCardChange.forEach((bcc) => bcc.addEventListener('click', () => this.ChangeCard(bcc)));
    const buttonsTabLink = document.querySelectorAll('button.tablink') as NodeListOf<HTMLElement>;
    buttonsTabLink.forEach((b) => b.addEventListener('click', () => this.ChangeTab(b)));
  }

  private ApplyInformation(): void {
    const cardTypeTag = document.querySelectorAll('#cardType') as NodeListOf<HTMLElement>;
    const cardTypeTextTag = document.querySelectorAll('#cardTypeText') as NodeListOf<HTMLElement>;
    const cardCostTag = document.querySelectorAll('#cardCost') as NodeListOf<HTMLElement>;
    const cardPrivilegeTag = document.querySelectorAll('#cardPrivilege') as NodeListOf<HTMLElement>;
    const cardNumberTag = document.querySelectorAll('#cardNumber') as NodeListOf<HTMLElement>;
    const cardMaxСonsumptionTag = document.querySelectorAll('#cardMaxСonsumption') as NodeListOf<HTMLElement>;

    const card = this.player.bankCard;
    const definedCardTypeClassName = card.DefineTypeClassName(card.type) as string;
    const definedCardTypeName = card.DefineTypeName(card.type) as string;

    cardTypeTag.forEach((ctt) => ctt.classList.add(definedCardTypeClassName));
    cardTypeTextTag.forEach((cttt) => cttt.innerText = definedCardTypeName);
    cardCostTag.forEach((cct) => cct.innerText = this.cashFormat.format(card.cost));
    cardPrivilegeTag.forEach((cpt) => cpt.innerText = card.privilege);
    cardNumberTag.forEach((cttt) => cttt.innerText = card.ConvertCardNumber(card.number));
    cardMaxСonsumptionTag.forEach((cmct) => cmct.innerText = this.cashFormat.format(card.maxConsumption));

    this.Render(true);
  }

  private Render(isPlayerHaveCard: boolean): void {
    !isPlayerHaveCard ? this.cardIssueTag.classList.remove('hide') : this.cardMenuTag.classList.remove('hide');
  }

  private ChangeCard(button: HTMLButtonElement): void {
    const ChangeOrientation = button.getAttribute('data-orientation') as string;

    this.RemoveCardInformation(this.tempCard);

    if (ChangeOrientation === 'previous') {
      this.tempCard.type > 1 ? this.tempCard.ChangeCardType(this.tempCard.type - 1) : this.tempCard.type = 4;
    } else {
      this.tempCard.type < 4 ? this.tempCard.ChangeCardType(this.tempCard.type + 1) : this.tempCard.type = 1;
    }

    this.AddCardInformation(this.tempCard);
  }

  private AddCardInformation(card: BankCard): void {
    this.cardSelectorTypeTag.classList.add(card.typeClassName);
    this.cardSelectorTypeTextTag.innerText = card.typeName;
    this.cardSelectorNumberTag.innerText = card.ConvertCardNumber(card.number);
    this.cardSelectorCostTag.innerText = this.cashFormat.format(card.cost);
    this.cardSelectorPrivilegeTag.innerText = card.privilege;
  }

  private RemoveCardInformation(card: BankCard): void {
    this.cardSelectorTypeTag.classList.remove(card.typeClassName);
    this.cardSelectorTypeTextTag.innerText = '';
    this.cardSelectorNumberTag.innerText = '';
    this.cardSelectorCostTag.innerText = '';
    this.cardSelectorPrivilegeTag.innerText = '';
  }

  private Replenishment(): void {
    //TODO Replenishment cash to card
  }

  private Withdraw(): void {
    //TODO widthdraw cash from card
    // do not forgive for max consumption
  }

  private Payment(): void {
    //TODO payment fines, taxes, phone
  }

  private ChangeTab(selectedTab: HTMLElement): void {
    const selectedTabId = selectedTab.getAttribute('data-tab');
    const selectedTabLinkId = selectedTab.id;

    const tabs = document.getElementsByClassName('tab-content') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < tabs.length; i++) {
      const isSelectedTab = tabs[i].id === selectedTabId;
      if (isSelectedTab) {
        tabs[i].querySelector('div.tab-content')?.classList.add('active');
        tabs[i].querySelector('button.tablink')?.classList.add('active');
        tabs[i].classList.add('active');
      } else {
        tabs[i].classList.remove('active');
        tabs[i].querySelector('div.tab-content.active')?.classList.remove('active');
        tabs[i].querySelector('button.tablink.active')?.classList.remove('active');
      }
    }

    const tabLinks = document.getElementsByClassName('tablink') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < tabLinks.length; i++) {
      const isSelectedTabLink = tabLinks[i].id === selectedTabLinkId;
      if (isSelectedTabLink) {
        tabLinks[i].classList.add('active');
      } else {
        tabLinks[i].classList.remove('active');
      }
    }
  }
};

// (window as any).bankMenuUi = new BankMenuUi();