import { RemoteEvent } from '../../models/enums/events/remote-event';
import { LocalEvent } from '../../models/enums/events/local-event';
import { RemoteResponse } from '../../models/enums/events/remote-response';
import { CameraConstants } from '../../constants/camera';
import { AuthenticationErrorType } from '../../models/enums/authentication-error-type';

class Authentication {
  private readonly browser: BrowserMp;
  private readonly camera: CameraMp;

  public constructor() {
    this.camera = mp.cameras.new('default', CameraConstants.StandardCameraPosition, CameraConstants.StandardCameraRotation, CameraConstants.StandardCameraFOV);

    this.browser = mp.browsers.new('package://components/Authentication/authentication.html');

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

    mp.events.add(RemoteResponse.LoginFailed, (m: string) => this.ErrorMessage(AuthenticationErrorType.Login, m));
    mp.events.add(RemoteResponse.RegistrationFailed, (m: string) => this.ErrorMessage(AuthenticationErrorType.Registration, m));

    mp.events.add(LocalEvent.Login, (u: string, p: string) => this.Login(u, p));
    mp.events.add(LocalEvent.Registration, (u: string, e: string, p: string) => this.Registration(e, u, p));
  }

  private Close(): void {
    this.browser.destroy();
  }

  private ErrorMessage(type: AuthenticationErrorType, message: string): void {
    this.browser.execute(`window.authenticationUi.ShowErrorMessage(${type}, '${message}');`);
  }

  private Login(username: string, password: string): void {
    mp.events.callRemote(RemoteEvent.Login, username, password);
  }

  private Registration(username: string, email: string, password: string): void {
    mp.events.callRemote(RemoteEvent.Registration, username, email, password);
  }
}

let authentication: Authentication | undefined;
mp.events.add(RemoteResponse.LoginAllowed, () => authentication = authentication ? authentication : new Authentication());
