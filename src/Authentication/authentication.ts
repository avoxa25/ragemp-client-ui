abstract class AuthenticationUi {
  public static Start(): void {
    const buttonsTabLink = document.querySelectorAll('.tablink') as NodeListOf<HTMLElement>;
    buttonsTabLink.forEach((b) => b.addEventListener('click', () => AuthenticationUi.ChangeTab(b)));
  }

  private static ChangeTab(selectedTab: HTMLElement): void {
    const selectedTabId = selectedTab.getAttribute('data-tab');
    const selectedTabLinkId = selectedTab.id;

    const tabs = document.querySelectorAll('section.tab') as NodeListOf<HTMLElement>;
    for (let i = 0; i < tabs.length; i++) {
      const isSelectedTab = tabs[i].id === selectedTabId;
      if (isSelectedTab) {
        tabs[i].querySelector('.tablink')?.classList.add('active');
        tabs[i].classList.add('active-flex');
      } else {
        tabs[i].classList.remove('active-flex');
        tabs[i].querySelector('.tablink.active')?.classList.remove('active');
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

AuthenticationUi.Start(); 