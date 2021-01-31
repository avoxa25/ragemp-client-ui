import { version } from '../../../../package.json';

class AlphaTestUi {
  public constructor() {
    lottie.loadAnimation({
      container: document.getElementById('animationAlphaTest'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/anim-alpha-test.json'
    });

    const clientVersionElement = document.querySelector('#clientVersion') as HTMLElement;
    clientVersionElement.innerText = version;
  }

  public SetServerVersion(serverVersion: string): void {
    const serverVersionElement = document.querySelector('#serverVersion') as HTMLElement;
    serverVersionElement.innerText = serverVersion;
  }
}

const alphaTestUi = new AlphaTestUi();
(window as any).alphaTestUi = alphaTestUi;