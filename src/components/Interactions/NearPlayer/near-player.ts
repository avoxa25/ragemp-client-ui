class InteractionNearPlayerUi {
  constructor() {
    this.MouseOverHandler();
    this.TransitionBetweenMenus();
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
      })
    })
  }

  private Show(): void {
    const InCarSection = document.querySelector('#menuCarInside') as HTMLElement;
    InCarSection.classList.add('active');
  }

  private Hide(): void {
    const InCarSection = document.querySelector('#menuCarInside') as HTMLElement;
    InCarSection.classList.remove('active');
  }
};

const interactionNearPlayerUi = new InteractionNearPlayerUi();
(window as any).interactionNearPlayerUi = interactionNearPlayerUi;