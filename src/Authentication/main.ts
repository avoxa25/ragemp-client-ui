import { RemoteEvents } from "../Constants/remote-events";
import { LocalEvents } from "../Constants/local-events";
import { RemoteResponse } from "../Constants/remote-response";

abstract class Authentication {
  private static browser: BrowserMp;
  private static camera: CameraMp;

  public static Start(): void {
    const camera = new mp.Vector3(344.3341, -998.8612, -98.19622);
    const cameraLookAt = new mp.Vector3(0.0, 0.0, 0.0);
    Authentication.camera = mp.cameras.new('default', camera, cameraLookAt, 40);

    mp.gui.chat.show(false);
    mp.gui.chat.activate(false);

    mp.events.add(RemoteResponse.AuthenticationAllowed, () => Authentication.Open());
    mp.events.add(RemoteResponse.AuthenticationSuccess, () => Authentication.Close());
    mp.events.add(RemoteResponse.LoginFailed, (m: string) => Authentication.ErrorMessage(m, 'loginForm'));
    mp.events.add(RemoteResponse.RegistrationFailed, (m: string) => Authentication.ErrorMessage(m, 'registrationForm'));

    mp.events.add(LocalEvents.AuthenticationUiLogin, (u: string, p: string) => Authentication.Login(u, p));
    mp.events.add(LocalEvents.AuthenticationUiRegistration, (u: string, e: string, p: string) => Authentication.Registration(u, e, p));
  }

  private static Open(): void {
    Authentication.browser = mp.browsers.new('package://Authentication/authentication.html');

    mp.players.local.freezePosition(true);

    mp.game.ui.displayRadar(false);
    mp.game.ui.displayHud(false);

    mp.gui.chat.activate(false);
    mp.gui.chat.show(false);

    mp.gui.cursor.show(true, true);

    Authentication.camera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);
  }

  private static Close(): void {
    Authentication.browser.destroy();

    Authentication.camera.setActive(false);
    Authentication.camera.destroy();
  }

  private static ErrorMessage(message: string, type: string): void {
    Authentication.browser.execute(`window.authenticationUi.ShowErrorMessage('${type}', '${message}');`);
  }

  private static Login(username: string, password: string): void {
    mp.events.callRemote(RemoteEvents.Login, username, password);
  }

  private static Registration(username: string, email: string, password: string): void {
    mp.events.callRemote(RemoteEvents.Registration, username, email, password)
  }
}

Authentication.Start();