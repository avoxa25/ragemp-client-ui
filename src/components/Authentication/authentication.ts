import { LocalEvent } from '../../constants/events/local-event';
import { ErrorMessage } from '../../constants/enums/error-message';
import { AuthenticationErrorType } from '../../constants/enums/authentication-error-type';

class AuthenticationUi {
  public constructor() {
    const buttonsTabLink = document.querySelectorAll('.tabLink') as NodeListOf<HTMLElement>;
    buttonsTabLink.forEach((b) => b.addEventListener('click', () => this.ChangeTab(b)));

    this.StartLoginTab();
    this.StartRegistrationTab();
    this.StartRecoveryTab();
  }
  public ShowErrorMessage(type: AuthenticationErrorType, message: string): void {
    let errorMessage;
    switch (type) {
      case AuthenticationErrorType.Login:
        errorMessage = document.querySelector('p.login-tab') as HTMLElement;
        break;
      case AuthenticationErrorType.Registration:
        errorMessage = document.querySelector('p.registration-tab') as HTMLElement;
        break;
    }

    errorMessage.hidden = false;
    errorMessage.innerText = message;
  };

  private ChangeTab(selectedTab: HTMLElement): void {
    const selectedTabId = selectedTab.getAttribute('data-tab');
    const selectedTabLinkId = selectedTab.id;

    const tabs = document.querySelectorAll('section.tab') as NodeListOf<HTMLElement>;
    for (let i = 0; i < tabs.length; i++) {
      const isSelectedTab = tabs[i].id === selectedTabId;
      if (isSelectedTab) {
        tabs[i].querySelector('.tabLink')?.classList.add('active');
        tabs[i].classList.add('active-flex');
      } else {
        tabs[i].classList.remove('active-flex');
        tabs[i].querySelector('.tabLink.active')?.classList.remove('active');
      }
    }

    const tabLinks = document.getElementsByClassName('tabLink') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < tabLinks.length; i++) {
      const isSelectedTabLink = tabLinks[i].id === selectedTabLinkId;
      if (isSelectedTabLink) {
        tabLinks[i].classList.add('active');
      } else {
        tabLinks[i].classList.remove('active');
      }
    }
  }

  private StartLoginTab(): void {
    const form = document.querySelector('#loginTab > form') as HTMLFormElement;
    form.addEventListener('submit', () => this.OnLoginFormSubmit(form));
  }

  private StartRegistrationTab(): void {
    const form = document.querySelector('#registrationTab > form') as HTMLFormElement;
    form.addEventListener('submit', () => this.OnRegistrationFormSubmit(form));
  }

  private OnLoginFormSubmit(form: HTMLFormElement): void {
    const formData = new FormData(form);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (username === '' || password === '') return this.ShowErrorMessage(AuthenticationErrorType.Login, ErrorMessage.FillEmptyFields);

    mp.events.call(LocalEvent.Login, username, password);
  }

  private OnRegistrationFormSubmit(form: HTMLFormElement): void {
  
    const formData = new FormData(form);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const passwordConfirm = formData.get('passwordConfirm') as string;

    if (username === '' || email === '' || password === '' || passwordConfirm === '') return this.ShowErrorMessage(AuthenticationErrorType.Registration, ErrorMessage.FillEmptyFields);
    if (username.length < 5) return this.ShowErrorMessage(AuthenticationErrorType.Registration, ErrorMessage.LoginTooShort);
    if (username.length > 15) return this.ShowErrorMessage(AuthenticationErrorType.Registration, ErrorMessage.LoginTooLong);
    if (password.length < 7) return this.ShowErrorMessage(AuthenticationErrorType.Registration, ErrorMessage.PasswordTooShort);
    if (password.length > 30) return this.ShowErrorMessage(AuthenticationErrorType.Registration, ErrorMessage.PasswordTooLong);
    if (password !== passwordConfirm) return this.ShowErrorMessage(AuthenticationErrorType.Registration, ErrorMessage.PasswordsNotMatch);

    mp.events.call(LocalEvent.Registration, username, email, password);
  }

  private StartRecoveryTab(): void {
    const form = document.querySelector('#recoveryTab > form') as HTMLFormElement;
    form.addEventListener('submit', () => this.OnRecoveryFormSubmit(form));
  }

  private OnRecoveryFormSubmit(form: HTMLFormElement): void {
    const formData = new FormData(form);
    const recovery = formData.get('recovery') as string;
    const successMessage = document.querySelector('#recoveryTab .success') as HTMLElement;

    // TODO: Send Recovery Code to the user Email
  }
}

const authenticationUi = new AuthenticationUi();
(window as any).authenticationUi = authenticationUi;