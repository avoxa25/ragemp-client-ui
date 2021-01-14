abstract class MainMenuUi {
  public static Start(): void {
    const buttonsTabLink = document.querySelectorAll('button.tablink') as NodeListOf<HTMLElement>;
    const buttonsTabContentLink = document.querySelectorAll('button.tab-content-link') as NodeListOf<HTMLElement>;
    console.log(buttonsTabLink);
    console.log(buttonsTabContentLink);
    buttonsTabLink.forEach((b) => b.addEventListener('click', () => MainMenuUi.ChangeTab(b)));
    buttonsTabContentLink.forEach((bu) => bu.addEventListener('click', () => MainMenuUi.ChangeTabContent(bu)));
  }

  private static ChangeTab(selectedTab: HTMLElement): void {
    console.log(selectedTab);
    const selectedTabId = selectedTab.getAttribute('data-tab');
    const selectedTabLinkId = selectedTab.id;

    const tabs = document.getElementsByClassName('tab') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < tabs.length; i++) {
      const isSelectedTab = tabs[i].id === selectedTabId;
      if (isSelectedTab) {
        tabs[i].querySelector('div.tab-content')?.classList.add('active');
        tabs[i].querySelector('button.tab-content-link')?.classList.add('active');
        tabs[i].classList.add('active');
      } else {
        tabs[i].classList.remove('active');
        tabs[i].querySelector('div.tab-content.active')?.classList.remove('active');
        tabs[i].querySelector('button.tab-content-link.active')?.classList.remove('active');
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

  private static ChangeTabContent(selectedTab: HTMLElement): void {
    console.log(selectedTab);
    const selectedTabId = selectedTab.getAttribute('data-tab');
    const selectedTabLinkId = selectedTab.id;

    const tabs = document.getElementsByClassName('tab-content') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < tabs.length; i++) {
      const isSelectedTab = tabs[i].id === selectedTabId;
      if (isSelectedTab) {
        tabs[i].classList.add('active');
      } else {
        tabs[i].classList.remove('active');
      }
    }

    const tabLinks = document.getElementsByClassName('tab-content-link') as HTMLCollectionOf<HTMLElement>;
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

MainMenuUi.Start();
