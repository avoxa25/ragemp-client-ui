abstract class AuthenticationUi {
  public static Start(): void {
    const buttonsTabLink = document.querySelectorAll('.tablink') as NodeListOf<HTMLElement>;
    buttonsTabLink.forEach((b) => b.addEventListener('click', () => AuthenticationUi.ChangeTab(b)));

    AuthenticationUi.StartLoginTab();
    AuthenticationUi.StartRegistrationTab();
    AuthenticationUi.StartRecoveryTab();
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

  private static StartLoginTab(): void {
    const form = document.querySelector('#loginTab > form') as HTMLFormElement;
    form.addEventListener('submit', () => AuthenticationUi.OnLoginFormSubmit(form));
  }

  private static OnLoginFormSubmit(form: HTMLFormElement): void {
    const formData = new FormData(form);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    // TODO: Call Rage MP ebat
  }

  private static StartRegistrationTab(): void {
    const form = document.querySelector('#registrationTab > form') as HTMLFormElement;
    form.addEventListener('submit', () => AuthenticationUi.OnRegistrationFormSubmit(form));
  }

  private static OnRegistrationFormSubmit(form: HTMLFormElement): void {
    const formData = new FormData(form);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const passwordConfirm = formData.get('passwordConfirm') as string;

    if (password !== passwordConfirm) {
      const errorMessage = document.querySelector('#registrationTab .denied') as HTMLElement;
      errorMessage.hidden = false;
      return;
    }

    // TODO: Call Rage MP ebat
  }

  private static StartRecoveryTab(): void {
    const form = document.querySelector('#recoveryTab > form') as HTMLFormElement;
    form.addEventListener('submit', () => AuthenticationUi.OnRecoveryFormSubmit(form));
  }

  private static OnRecoveryFormSubmit(form: HTMLFormElement) {
    const formData = new FormData(form);
    const recovery = formData.get('recovery') as string;
    const successMessage = document.querySelector('#recoveryTab .success') as HTMLElement;

    successMessage.hidden = false;
    // TODO: Call Rage MP ebat
  }
};

AuthenticationUi.Start();

