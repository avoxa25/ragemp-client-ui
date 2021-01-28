import { RemoteEvents } from '../Constants/remote-events';
import { LocalEvents } from '../Constants/local-events';
import { RemoteResponse } from '../Constants/remote-response';
import { CameraConstants } from '../Constants/camera-constants';
import { ErrorTypes } from './authentications-errors';

class Authentication {
  private readonly browser: BrowserMp;
  private readonly camera: CameraMp;

  public constructor() {
    this.camera = mp.cameras.new('default', CameraConstants.StandardCameraPosition, CameraConstants.StandardCameraRotation, CameraConstants.StandardCameraFOV);

    this.browser = mp.browsers.new('package://Authentication/authentication.html');

    mp.players.local.freezePosition(true);

    mp.game.ui.displayRadar(false);
    mp.game.ui.displayHud(false);

    mp.gui.chat.activate(false);
    mp.gui.chat.show(false);

    mp.gui.cursor.show(true, true);

    this.camera.pointAtCoord(CameraConstants.StandardCameraPoint.x, CameraConstants.StandardCameraPoint.y, CameraConstants.StandardCameraPoint.z);
    this.camera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);

    mp.events.add(RemoteResponse.RegistrationSuccess, () => this.Close());
    mp.events.add(RemoteResponse.LoginSuccess, () => this.Close());

    mp.events.add(RemoteResponse.LoginFailed, (m: string) => this.ErrorMessage(m, ErrorTypes.Login));
    mp.events.add(RemoteResponse.RegistrationFailed, (m: string) => this.ErrorMessage(m, ErrorTypes.Registration));

    mp.events.add(LocalEvents.AuthenticationUiLogin, (u: string, p: string) => this.Login(u, p));
    mp.events.add(LocalEvents.AuthenticationUiRegistration, (u: string, e: string, p: string) => this.Registration(e, u, p));
  }

  private Close(): void {
    this.browser.destroy();

    this.camera.setActive(false);
    this.camera.destroy();
  }

  private ErrorMessage(message: string, type: string): void {
    this.browser.execute(`window.authenticationUi.ShowErrorMessage('${type}', '${message}');`);
  }

  private Login(username: string, password: string): void {
    mp.events.callRemote(RemoteEvents.Login, username, password);
  }

  private Registration(username: string, email: string, password: string): void {
    mp.events.callRemote(RemoteEvents.Registration, username, email, password)
  }
}

let authentication: Authentication | undefined;
mp.events.add(RemoteResponse.LoginAllowed, () => authentication = authentication ? authentication : new Authentication());
