const maxDistance = 25 * 25;
const width = 0.03;
const height = 0.0065;
const border = 0.001;
const color = [255, 255, 255, 255];
const ToogleKey = 0x35; // 5 key

abstract class Render {
  private static isActive: boolean;

  public static Start(): void {
    mp.nametags.enabled = false;

    Render.isActive = true;
    mp.events.add('render', Render.Nicknames);
    mp.keys.bind(ToogleKey, true, Render.Toogle);
  }

  private static Toogle(): void {
    Render.isActive = !Render.isActive
    if (Render.isActive) {
      // Notify: on
      mp.events.add('render', Render.Nicknames);
    } else {
      // Notify: off
      mp.events.remove('render', Render.Nicknames);
    }
  }

  private static CalculateDistance(v1: Vector3Mp, v2: Vector3Mp) {
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  private static Nicknames(nametags: any): void {
    const graphics = mp.game.graphics;
    const screenRes = graphics.getScreenResolution(0, 0);

    nametags.forEach((nametag: any) => {
      try {
        let [player, x, y, distance] = nametag;

        if (distance <= maxDistance) {
          let scale = (distance / maxDistance);
          if (scale < 0.6) scale = 0.6;
  
          var health = player.getHealth();
          health = health < 100 ? 0 : ((health - 100) / 100);
  
          var armour = player.getArmour() / 100;
          armour = armour < 100 ? 0 : ((armour - 100) / 100);
  
          y -= scale * (0.005 * (screenRes.y / 1080));
  
          graphics.drawText(`${player.name.replace('_', ' ')} (${player.remoteId})`, [x, y],
            {
              font: 4,
              centre: false,
              color: [1, 1, 1, 1],
              scale: [0.4, 0.4],
              outline: true
            });
        }
      } catch {};
    });
  }
}

Render.Start();