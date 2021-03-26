class OnlineUi {
  private readonly onlineElement: HTMLElement;

  public constructor() {
    lottie.loadAnimation({
      container: document.getElementById('animationLogo'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/animlogo.json'
    });

    this.onlineElement = document.querySelector('#online') as HTMLElement;
  }

  private SetOnline(online: string) {
    this.onlineElement.innerText = online;
  }
}

const onlineUi = new OnlineUi();
(window as any).onlineUi = onlineUi; 