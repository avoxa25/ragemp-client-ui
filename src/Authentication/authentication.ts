import { LocalEvents } from "src/Constants/localEvents";
import { ErrorMessages } from "../Constants/errorMessages";

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

  private static StartRegistrationTab(): void {
    const form = document.querySelector('#registrationTab > form') as HTMLFormElement;
    form.addEventListener('submit', () => AuthenticationUi.OnRegistrationFormSubmit(form));
  }

  private static OnLoginFormSubmit(form: HTMLFormElement): void {
    const formData = new FormData(form);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (username === '' || password === '') return AuthenticationUi.ErrorMessage(form, ErrorMessages.FillEmptyFields);

    //mp.events.call(LocalEvents.AuthenticationUiLogin, username, password);
  }

  private static OnRegistrationFormSubmit(form: HTMLFormElement): void {
    const formData = new FormData(form);
    const username = formData.get('username') as string;
    const usernamePattern = new RegExp('[A-Za-z0-9]$');
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const passwordConfirm = formData.get('passwordConfirm') as string;

    if (username === '' || email === '' || password === '' || passwordConfirm === '') return AuthenticationUi.ErrorMessage(form, ErrorMessages.FillEmptyFields);
    if (!usernamePattern.test(username)) return AuthenticationUi.ErrorMessage(form, ErrorMessages.IncorrectLogin);
    if (username.length < 5) return AuthenticationUi.ErrorMessage(form, ErrorMessages.LoginTooShort);
    if (username.length > 15) return AuthenticationUi.ErrorMessage(form, ErrorMessages.LoginTooLong);
    if (password.length < 7) return AuthenticationUi.ErrorMessage(form, ErrorMessages.PasswordTooShort);
    if (password.length > 30) return AuthenticationUi.ErrorMessage(form, ErrorMessages.PasswordTooLong);
    if (password !== passwordConfirm) return AuthenticationUi.ErrorMessage(form, ErrorMessages.PasswordsNotMatch);

    //mp.events.call(LocalEvents.AuthenticationUiRegistration, username, email, password);
  }

  private static StartRecoveryTab(): void {
    const form = document.querySelector('#recoveryTab > form') as HTMLFormElement;
    form.addEventListener('submit', () => AuthenticationUi.OnRecoveryFormSubmit(form));
  }

  private static OnRecoveryFormSubmit(form: HTMLFormElement) {
    const formData = new FormData(form);
    const recovery = formData.get('recovery') as string;

    // TODO: Send Recovery Code to the user Email
  }

  private static ErrorMessage(form: HTMLFormElement, message: string) {
    const errorMessage = document.querySelector(`#${form.id} .denied`) as HTMLElement;
    errorMessage.hidden = false;
    errorMessage.textContent = message;

    setTimeout(() => errorMessage.hidden = true, 3000);
  }
};

AuthenticationUi.Start();