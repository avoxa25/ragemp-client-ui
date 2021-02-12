import { LocalEvent } from "../../../constants/events/local-event";

class InteractionCarInsideUi {
  constructor() {
    this.MouseOverHandler();
    this.TransitionBetweenMenus();
    this.EventListeners();
  }

  public Show(): void {
    const InCarSection = document.querySelector('#menuCarInside') as HTMLElement;
    InCarSection.classList.add('active');
  }

  public Hide(): void {
    const InCarSection = document.querySelector('#menuCarInside') as HTMLElement;
    InCarSection.classList.remove('active');
  }

  public ShowPassengers(): void {

  }

  private MouseOverHandler(): void {
    const menuItems = document.querySelectorAll("div.menu-item") as NodeListOf<Element>;

    menuItems.forEach((mi) => {
      const promptTagId = mi.getAttribute('data-id') as string;
      const prompt = mi.getAttribute('data-prompt') as string;
      mi.addEventListener('mouseover', () => this.ShowInformation(promptTagId, prompt));
      mi.addEventListener('mouseout', () => this.HideInformation(promptTagId));
    });
  }

  private ShowInformation(promptTagId: string, prompt: string): void {
    const promptTag = document.querySelector('#' + promptTagId) as HTMLElement;
    promptTag.innerHTML = prompt;
  }

  private HideInformation(promptTagId: string): void {
    const promptTag = document.querySelector('#' + promptTagId) as HTMLElement;
    if (promptTagId === 'carDoorsActionPrompt' || promptTagId === 'catapultPlayerListActionPrompt') {
      promptTag.innerHTML = 'Вернуться назад';
    } else {
      promptTag.innerHTML = '';
    }
  }

  private EventListeners(): void{
    const engineButton = document.querySelector('#actionCarTurnOn') as HTMLElement;
    const lockButton = document.querySelector('#actionCarLock') as HTMLElement;

    engineButton.addEventListener('click', () => {
      mp.events.call(LocalEvent.InteractionCarInsideToggleEngine);
    });

    lockButton.addEventListener('click', () => {
      mp.events.call(LocalEvent.InteractionCarInsideToggleLock);
    });
  }

  private TransitionBetweenMenus(): void {
    const menuLinks = document.querySelectorAll('.menuLink') as NodeListOf<HTMLElement>;

    menuLinks.forEach((ml) => {
      const menuId = ml.getAttribute('data-menu');
      ml.addEventListener('click', () => {
        const menus = document.querySelectorAll('section') as NodeListOf<HTMLElement>;

        for (let i = 0; i < menus.length; i++) {
          const isSelectedMenu = menus[i].id === menuId;
          if (isSelectedMenu) {
            menus[i].classList.add('active');
          } else {
            menus[i].classList.remove('active');
          }
        }
      });
    });
  }
};

const interactionCarInsideUi = new InteractionCarInsideUi();
(window as any).interactionCarInsideUi = interactionCarInsideUi;