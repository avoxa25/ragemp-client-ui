import { LocalEvents } from "../Constants/localEvents";
import { RemoteEvents } from "../Constants/remoteEvents";

abstract class Authentication {
  private static browser: BrowserMp;
  private static camera: CameraMp;

  public static Start(): void {
    const camera = new mp.Vector3(347, -1007.5515, -99.15);
    const cameraLookAt = new mp.Vector3(-0.0, 0.0, -93.0);
    Authentication.camera = mp.cameras.new('default', camera, cameraLookAt, 40);
    
    mp.gui.chat.show(false);
    mp.gui.chat.activate(false);

    mp.gui.cursor.show(true, true);

    mp.events.add(RemoteEvents.AuthenticationOpen, () => Authentication.Open());
    mp.events.add(RemoteEvents.AuthenticationClose, () => Authentication.Close());
    mp.events.add(RemoteEvents.AuthenticationLoginFailed, (m:string) => Authentication.ErrorMessage(m, 'login'));
    mp.events.add(RemoteEvents.AuthenticationRegistrationFailed, (m:string) => Authentication.ErrorMessage(m, 'registration'));
  }

  private static Open() : void
  {
    Authentication.browser = mp.browsers.new('package://CharacterCreator/character-creator.html');

    mp.players.local.freezePosition(true);

    mp.game.ui.displayRadar(false);
    mp.game.ui.displayHud(false);

    mp.gui.chat.activate(false);
    mp.gui.chat.show(false);

    mp.gui.cursor.show(true, true);

    Authentication.camera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);
  }

  private static Close(): void
  {
    Authentication.browser.destroy();

    Authentication.camera.setActive(false);
    Authentication.camera.destroy();
  }

  private static ErrorMessage(message: string, type: string) : void
  {
    switch(type)
    {
      case 'login':
        const form = document.querySelector('#loginForm') as HTMLFormElement;
        Authentication.browser.execute('')
        break;
      case 'registration':
        break;
    }
  }
}