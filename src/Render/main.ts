import { KeyboardKeys } from "src/Constants/keyboard-keys";

abstract class Render {
  private static maxDistance: number = 625;
  private static width: number = 0.03;
  private static height: number = 0.0065;
  private static border: number = 0.001;
  private static isActive: boolean = false;

  public static Start(): void {
    mp.nametags.enabled = false;
    Render.Toogle();
    mp.keys.bind(KeyboardKeys.Number5, true, () => Render.Toogle());
  }

  private static Toogle(): void {
    Render.isActive = !Render.isActive
    if (Render.isActive) {
      // Notify: on
      mp.events.add(RageEnums.EventKey.RENDER, (n) => Render.Nicknames(n));
    } else {
      // Notify: off
      mp.events.remove(RageEnums.EventKey.RENDER, (n) => Render.Nicknames(n));
    }
  }

  private static Nicknames(nametags: [PlayerMp, number, number, number][]): void {
    const graphics = mp.game.graphics;
    const screenRes = graphics.getScreenResolution(0, 0);

    nametags.forEach((nametag: [PlayerMp, number, number, number]) => {
      try {
        let player: PlayerMp = nametag[0];
        let x: number = nametag[1];
        let y: number = nametag[2];
        let distance: number = nametag[3];

        if (distance <= Render.maxDistance) {
          let scale = (distance / Render.maxDistance);
          if (scale < 0.6) scale = 0.6;

          var health = player.getHealth();
          health = health < 100 ? 0 : ((health - 100) / 100);

          var armour = player.getArmour() / 100;
          armour = armour < 100 ? 0 : ((armour - 100) / 100);

          y -= scale * (0.005 * (screenRes.y / 1080));

          let roles = mp.players.local.getVariable('Role') as string;
          if (roles == '') { // if user
            graphics.drawText(`${player.name.replace('_', ' ')} (${player.remoteId})`, [x, y],
              {
                font: 4,
                centre: false,
                color: [1, 1, 1, 1],
                scale: [0.4, 0.4],
                outline: true
              });
          }
          else { // if admin
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
              let x2 = x - Render.width / 2 - Render.border / 2;

              graphics.drawRect(x2, y2, Render.width + Render.border * 2, 0.0085, 0, 0, 0, 200);
              graphics.drawRect(x2, y2, Render.width, Render.height, 150, 150, 150, 255);
              graphics.drawRect(x2 - Render.width / 2 * (1 - health), y2, Render.width * health, Render.height, 255, 255, 255, 200);

              x2 = x + Render.width / 2 + Render.border / 2;

              graphics.drawRect(x2, y2, Render.width + Render.border * 2, Render.height + Render.border * 2, 0, 0, 0, 200);
              graphics.drawRect(x2, y2, Render.width, Render.height, 41, 66, 78, 255);
              graphics.drawRect(x2 - Render.width / 2 * (1 - armour), y2, Render.width * armour, Render.height, 48, 108, 135, 200);
            }
            else {
              graphics.drawRect(x, y2, Render.width + Render.border * 2, Render.height + Render.border * 2, 0, 0, 0, 200);
              graphics.drawRect(x, y2, Render.width, Render.height, 150, 150, 150, 255);
              graphics.drawRect(x - Render.width / 2 * (1 - health), y2, Render.width * health, Render.height, 255, 255, 255, 200);
            }
          }
        }
      } catch { };
    });
  }
}

Render.Start();