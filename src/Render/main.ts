import { KeyboardKeys } from "../Constants/keyboard-keys";

class Render {
  private maxDistance: number = 625;
  private width: number = 0.03;
  private height: number = 0.0065;
  private border: number = 0.001;
  private isActive: boolean = false;

  public Start(): void {
    mp.nametags.enabled = false;
    this.Toogle();
    mp.keys.bind(KeyboardKeys.Number5, true, () => this.Toogle());
  }

  private Toogle(): void {
    this.isActive = !this.isActive
    if (this.isActive) {
      mp.events.add(RageEnums.EventKey.RENDER, (n) => this.Nicknames(n));
    } else {
      mp.events.remove(RageEnums.EventKey.RENDER, (n) => this.Nicknames(n));
    }
  }

  private Nicknames(nametags: [PlayerMp, number, number, number][]): void {
    const graphics = mp.game.graphics;
    const screenRes = graphics.getScreenResolution(0, 0);

    nametags.forEach((nametag: [PlayerMp, number, number, number]) => {
      try {
        let player: PlayerMp = nametag[0];
        let x: number = nametag[1];
        let y: number = nametag[2];
        let distance: number = nametag[3];

        if (distance <= this.maxDistance) {
          let scale = (distance / this.maxDistance);
          if (scale < 0.6) scale = 0.6;

          let health = player.getHealth();
          health = health < 100 ? 0 : ((health - 100) / 100);

          let armour = player.getArmour() / 100;
          armour = armour < 100 ? 0 : ((armour - 100) / 100);

          y -= scale * (0.005 * (screenRes.y / 1080));

          let plyRoles = mp.players.local.getVariable('Role').split(',') as string[];
          let adminRoles: string[] = ['МОДЕРАТОР', 'СТАРШИЙ МОДЕРАТОР', 'МЛАДШИЙ МОДЕРАТОР', 'АДМИНИСТРАТОР', 'СТАРШИЙ АДМИНИСТРАТОР', 'ГЛАВНЫЙ АДМИНИСТРАТОР', 'ТЕХНИЧЕСКИЙ АДМИНИСТРАТОР', 'РАЗРАБОТЧИК']
          let intersect = function (arr1: string[], arr2: string[]) {
            return arr1.filter(function (n) {
              return arr2.indexOf(n) !== -1;
            });
          };
          if (intersect(plyRoles, adminRoles).length == 0) {
            graphics.drawText(`${player.name.replace('_', ' ')} (${player.remoteId})`, [x, y],
              {
                font: 4,
                centre: false,
                color: [1, 1, 1, 1],
                scale: [0.4, 0.4],
                outline: true
              });
          }
          else {
            graphics.drawText(`[${player.getVariable('Id')}] ${player.name.replace('_', ' ')} (${player.remoteId})`, [x, y],
              {
                font: 4,
                centre: false,
                color: [1, 1, 1, 1],
                scale: [0.4, 0.4],
                outline: true
              });

            let y2 = y + 0.042;

            if (armour > 0) {
              let x2 = x - this.width / 2 - this.border / 2;

              graphics.drawRect(x2, y2, this.width + this.border * 2, 0.0085, 0, 0, 0, 200);
              graphics.drawRect(x2, y2, this.width, this.height, 150, 150, 150, 255);
              graphics.drawRect(x2 - this.width / 2 * (1 - health), y2, this.width * health, this.height, 255, 255, 255, 200);

              x2 = x + this.width / 2 + this.border / 2;

              graphics.drawRect(x2, y2, this.width + this.border * 2, this.height + this.border * 2, 0, 0, 0, 200);
              graphics.drawRect(x2, y2, this.width, this.height, 41, 66, 78, 255);
              graphics.drawRect(x2 - this.width / 2 * (1 - armour), y2, this.width * armour, this.height, 48, 108, 135, 200);
            }
            else {
              graphics.drawRect(x, y2, this.width + this.border * 2, this.height + this.border * 2, 0, 0, 0, 200);
              graphics.drawRect(x, y2, this.width, this.height, 150, 150, 150, 255);
              graphics.drawRect(x - this.width / 2 * (1 - health), y2, this.width * health, this.height, 255, 255, 255, 200);
            }
          }
        }
      } catch (err) { };
    });
  }
}

new Render().Start();