import { SpecificLocalEvents } from '../Constants/specific-local-events';
import { LocalEvents } from '../Constants/local-events';
import { Settings } from './settings';

class MainMenuUi {
  private settings: Settings;
  
  public constructor(){
    this.settings = new Settings();

    const buttonsTabLink = document.querySelectorAll('button.tablink') as NodeListOf<HTMLElement>;
    const buttonsTabContentLink = document.querySelectorAll('button.tab-content-link') as NodeListOf<HTMLElement>;
    const closeButton = document.querySelector('#close') as HTMLElement;
    const switchesSettings = document.querySelectorAll('input.settings') as NodeListOf<HTMLElement>;

    closeButton.addEventListener('click', () => this.Hide());
    switchesSettings.forEach((s) => s.addEventListener('click', () => this.UpdateSettings(s)));
    buttonsTabLink.forEach((b) => b.addEventListener('click', () => this.ChangeTab(b)));
    buttonsTabContentLink.forEach((bu) => bu.addEventListener('click', () => this.ChangeTabContent(bu)));
  }

  private ChangeTab(selectedTab: HTMLElement): void {
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

  private ChangeTabContent(selectedTab: HTMLElement): void {
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

  private UpdateSettings(element: HTMLElement): void {
    element.toggleAttribute('checked');
    const toggled = element.hasAttribute('checked');
    switch (element.id) {
      case 'notify':
        this.settings.notificationsHidden = toggled;
        // TODO: toggle notifications
        return;
      case 'textChat':
        this.settings.textChatHidden = toggled;
        mp.events.call(SpecificLocalEvents.ChatActivate, toggled);
        return;
      case 'voiceChat':
        this.settings.voiceChatMuted = toggled;
        // TODO: toggle voicechat
        return;
    }
  }

  private Show(name: string, surname: string, gender: string, job: string, playerTime: string, orgName: string, orgRank: string, cash: number): void {
    const fullNameElement = document.querySelector('#fullName') as HTMLElement;
    const genderElement = document.querySelector('#gender') as HTMLElement;
    const jobElement = document.querySelector('#job') as HTMLElement;
    const playerTimeElement = document.querySelector('#playerTime') as HTMLElement;
    const orgNameElement = document.querySelector('#orgName') as HTMLElement;
    const orgRankElement = document.querySelector('#orgRank') as HTMLElement;
    const cashElement = document.querySelector('#cashElement') as HTMLElement;

    const formattedCash = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(cash);

    fullNameElement.innerText = `${name} ${surname}`;
    genderElement.innerText = gender;
    jobElement.innerText = job;
    playerTimeElement.innerText = playerTime;
    orgNameElement.innerText = orgName;
    orgRankElement.innerText = orgRank;
    cashElement.innerText = formattedCash;

    document.body.hidden = false;
  }

  private Hide(): void {
    document.body.hidden = true;
    mp.events.call(LocalEvents.MenuToggle, false);
  }
};

const mainMenuUi = new MainMenuUi();
(window as any).mainMenuUi = mainMenuUi;