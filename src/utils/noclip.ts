import { RoleConstants } from '../constants/role-constants';
import { KeyboardKeys } from '../constants/enums/keyboard-keys';
import { RemoteResponse } from '../constants/events/remote-response';
import { NotificationType } from '../constants/enums/notification-type';
import { KeyboardAsciiKeys } from '../constants/enums/keyboard-ascii-keys';

class NoClip {
  private isActive: boolean;
  private shiftModifier: boolean;
  private controlModifier: boolean;
  private static camera: CameraMp;

  constructor() {
    this.isActive = false;
    this.shiftModifier = false;
    this.controlModifier = false;

    mp.keys.bind(KeyboardKeys.Function2, true, () => this.Toggle());
    mp.events.add(RageEnums.EventKey.RENDER, () => this.Render());
  }

  private Render(): void {
    if (!NoClip.camera || !this.isActive || mp.gui.cursor.visible) {
      return;
    }
    this.controlModifier = mp.keys.isDown(KeyboardAsciiKeys.LeftAlt);
    this.shiftModifier = mp.keys.isDown(KeyboardAsciiKeys.LeftShift);

    let rotate = NoClip.camera.getRot(2);
    let fastMultiplier = 1;
    let slowMultiplier = 1;

    if (this.shiftModifier) {
      fastMultiplier = 3;
    } else if (this.controlModifier) {
      slowMultiplier = 0.5;
    }
    let rightAxisX = mp.game.controls.getDisabledControlNormal(0, 220);
    let rightAxisY = mp.game.controls.getDisabledControlNormal(0, 221);
    let leftAxisX = mp.game.controls.getDisabledControlNormal(0, 218);
    let leftAxisY = mp.game.controls.getDisabledControlNormal(0, 219);

    let camPosition = NoClip.camera.getCoord();
    let camDirection = NoClip.camera.getDirection();

    let vector = new mp.Vector3(0, 0, 0);
    vector.x = camDirection.x * leftAxisY * fastMultiplier * slowMultiplier;
    vector.y = camDirection.y * leftAxisY * fastMultiplier * slowMultiplier;
    vector.z = camDirection.z * leftAxisY * fastMultiplier * slowMultiplier;

    let upVector = new mp.Vector3(0, 0, 1);
    let rightVector = this.GetRightVector(
      this.GetNormalizedVector(camDirection),
      this.GetNormalizedVector(upVector)
    );
    rightVector.x *= leftAxisX * 0.5 * fastMultiplier * slowMultiplier;
    rightVector.y *= leftAxisX * 0.5 * fastMultiplier * slowMultiplier;
    rightVector.z *= leftAxisX * 0.5 * fastMultiplier * slowMultiplier;

    let upMovement = 0.0;
    if (mp.keys.isDown(KeyboardAsciiKeys.Space)) upMovement = 0.7;

    let downMovement = 0.0;
    if (mp.keys.isDown(KeyboardAsciiKeys.LeftControl)) downMovement = 0.7;

    mp.players.local.position = new mp.Vector3(
      camPosition.x + vector.x + 1,
      camPosition.y + vector.y + 1,
      camPosition.z + vector.z + 1
    );

    mp.players.local.heading = camDirection.z;

    NoClip.camera.setCoord(
      camPosition.x - vector.x + rightVector.x,
      camPosition.y - vector.y + rightVector.y,
      camPosition.z - vector.z + rightVector.z + upMovement - downMovement
    );

    if (rotate.x > 84 && rightAxisY < 0) rightAxisY = 0
    if (rotate.x < -80 && rightAxisY > 0) rightAxisY = 0
    NoClip.camera.setRot(
      rotate.x + rightAxisY * -5.0,
      0.0,
      rotate.z + rightAxisX * -5.0,
      2
    );
  }

  private Toggle(): void {
    this.isActive = !this.isActive;
    mp.game.ui.displayRadar(!this.isActive);
    if (this.isActive) {
      mp.events.call(RemoteResponse.NotificationSent, NotificationType.Info, 'Noclip включен');

      let camPosition = new mp.Vector3(
        mp.players.local.position.x,
        mp.players.local.position.y,
        mp.players.local.position.z
      );
      let camRotation = mp.game.cam.getGameplayCamRot(2);

      NoClip.camera = mp.cameras.new('default', camPosition, camRotation, 45);
      NoClip.camera.setActive(true);
      mp.game.cam.renderScriptCams(true, false, 0, true, false);

      mp.players.local.freezePosition(true);
      mp.players.local.setInvincible(true);
      mp.players.local.setVisible(false, false);
      mp.players.local.setCollision(false, false);
    } else {
      mp.events.call(RemoteResponse.NotificationSent, NotificationType.Info, 'Noclip выключен');

      if (NoClip.camera) {
        mp.players.local.position = NoClip.camera.getCoord();
        mp.players.local.setHeading(NoClip.camera.getRot(2).z);
        NoClip.camera.destroy(true);
      }

      mp.game.cam.renderScriptCams(false, false, 0, true, false);
      mp.players.local.freezePosition(false);
      mp.players.local.setInvincible(false);
      mp.players.local.setVisible(true, false);
      mp.players.local.setCollision(true, false);
    }
  }

  private GetRightVector(v1: Vector3Mp, v2: Vector3Mp): Vector3Mp {
    let vector = new mp.Vector3(0, 0, 0);
    vector.x = v1.y * v2.z - v1.z * v2.y;
    vector.y = v1.z * v2.x - v1.x * v2.z;
    vector.z = v1.x * v2.y - v1.y * v2.x;
    return vector;
  }

  private GetNormalizedVector(vector: Vector3Mp): Vector3Mp {
    let vectorSquareRoot = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
    vector.x = vector.x / vectorSquareRoot;
    vector.y = vector.y / vectorSquareRoot;
    vector.z = vector.z / vectorSquareRoot;
    return vector;
  }
};

let noClip: NoClip | undefined;

function intersect(arr1: string[], arr2: string[]) {
  return arr1.filter(function (n) {
    return arr2.indexOf(n) !== -1;
  });
};

mp.events.add(RemoteResponse.CharacterSpawnSelected, () => {
  let playerRoles = mp.players.local.getVariable('Role').split(',') as string[];
  
  if (intersect(playerRoles, RoleConstants.Admin).length == 0) return;

  noClip = noClip ? noClip : new NoClip()
});

// TODO: Refactor this shit code