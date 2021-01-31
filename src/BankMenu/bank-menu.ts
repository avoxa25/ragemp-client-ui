class BankMenuUi {

  public constructor() {
    const buttonsTabLink = document.querySelectorAll('button.tablink') as NodeListOf<HTMLElement>;
    buttonsTabLink.forEach((b) => b.addEventListener('click', () => BankMenuUi.ChangeTab(b)));
  }

  private static ChangeTab(selectedTab: HTMLElement): void {
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

(window as any).bankMenuUi = new BankMenuUi();