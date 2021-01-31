class OnlineUi {
  private currentOnlineElement: HTMLElement;

  public constructor() {
    lottie.loadAnimation({
      container: document.getElementById('animationLogo'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/animlogo.json'
    });

    this.currentOnlineElement = document.querySelector('#currentOnline') as HTMLElement;
  }

  private SetCurrentOnline(currentOnline: string) {
    this.currentOnlineElement.innerText = currentOnline;
  }
}

const onlineUi = new OnlineUi();
(window as any).onlineUi = onlineUi;