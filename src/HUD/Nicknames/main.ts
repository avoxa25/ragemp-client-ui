import { RoleConstants } from '../../Constants/role.constants';
import { KeyboardKeys } from '../../Constants/keyboard-keys';
import { RemoteResponse } from '../../Constants/remote-response';

class Render {
  private readonly maxDistance: number = 625;
  private readonly width: number = 0.03;
  private readonly height: number = 0.0065;
  private readonly border: number = 0.001;
  private readonly graphics: GameGraphicsMp;
  private isActive: boolean = false;

  constructor() {
    this.graphics = mp.game.graphics;
    mp.nametags.enabled = false;
    this.Toogle();
    mp.keys.bind(KeyboardKeys.Function11, true, () => this.Toogle());
  }

  private Toogle(): void {
    this.isActive = !this.isActive
    if (this.isActive) mp.events.add(RageEnums.EventKey.RENDER, (n) => this.Nicknames(n));
    else mp.events.remove(RageEnums.EventKey.RENDER, (n) => this.Nicknames(n));
  }

  private ArrayIntersect(arr1: string[], arr2: string[]): string[]{
    return arr1.filter(function (n) {
      return arr2.indexOf(n) !== -1;
    });
  }

  private Nicknames(nametags: [PlayerMp, number, number, number][]): void {
    const screenRes = this.graphics.getScreenResolution(0, 0);

    nametags.forEach((nametag: [PlayerMp, number, number, number]) => {
      try {
        let player: PlayerMp = nametag[0];
        let x: number = nametag[1];
        let y: number = nametag[2];
        const distance: number = nametag[3];

        if (distance <= this.maxDistance) {
          let scale = (distance / this.maxDistance);
          if (scale < 0.6) scale = 0.6;

          let health = player.getHealth();
          health = health < 100 ? 0 : ((health - 100) / 100);

          let armor = player.getArmour() / 100;
          armor = armor < 100 ? 0 : ((armor - 100) / 100);

          y -= scale * (0.005 * (screenRes.y / 1080));

          const plyRoles = mp.players.local.getVariable('Role').split(',') as string[];
          
          if (this.ArrayIntersect(plyRoles, RoleConstants.Admin).length == 0) {
            this.graphics.drawText(`${player.name.replace('_', ' ')} (${player.remoteId})`, [x, y],
              {
                font: 4,
                centre: false,
                color: [1, 1, 1, 1],
                scale: [0.4, 0.4],
                outline: true
              });
          } else {
            this.graphics.drawText(`[${player.getVariable('Id')}] ${player.name.replace('_', ' ')} (${player.remoteId})`, [x, y],
              {
                font: 4,
                centre: false,
                color: [1, 1, 1, 1],
                scale: [0.4, 0.4],
                outline: true
              });

            let y2 = y + 0.042;

            if (armor > 0) {
              let x2 = x - this.width / 2 - this.border / 2;

              this.graphics.drawRect(x2, y2, this.width + this.border * 2, 0.0085, 0, 0, 0, 200);
              this.graphics.drawRect(x2, y2, this.width, this.height, 150, 150, 150, 255);
              this.graphics.drawRect(x2 - this.width / 2 * (1 - health), y2, this.width * health, this.height, 255, 255, 255, 200);

              x2 = x + this.width / 2 + this.border / 2;

              this.graphics.drawRect(x2, y2, this.width + this.border * 2, this.height + this.border * 2, 0, 0, 0, 200);
              this.graphics.drawRect(x2, y2, this.width, this.height, 41, 66, 78, 255);
              this.graphics.drawRect(x2 - this.width / 2 * (1 - armor), y2, this.width * armor, this.height, 48, 108, 135, 200);
            } else {
              this.graphics.drawRect(x, y2, this.width + this.border * 2, this.height + this.border * 2, 0, 0, 0, 200);
              this.graphics.drawRect(x, y2, this.width, this.height, 150, 150, 150, 255);
              this.graphics.drawRect(x - this.width / 2 * (1 - health), y2, this.width * health, this.height, 255, 255, 255, 200);
            }
          }
        }
      } catch (err) { };
    });
  }
}

let render: Render;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => render = render ? render : new Render());

render = new Render();