export abstract class InteractionHelper {
  private static readonly range = 3.0 as number;

  public static GetNeareastObject(): PlayerMp | ObjectMp | null {
    let tempObject = null as PlayerMp | ObjectMp | null;

    if (mp.players.local.isInAnyVehicle(false)) {
      const players = mp.players.toArray();
      players.forEach((player) => {
        const playerLocalPosition = mp.players.local.position;
        const playerPosition = player.position;
        const distance = InteractionHelper.GetDistanceBetweenVectors(playerLocalPosition, playerPosition, true);

        if (mp.players.local === player && mp.players.local.dimension !== player.dimension && distance > InteractionHelper.range) return;
        if (tempObject === null) tempObject = player;
        if (InteractionHelper.GetDistanceBetweenVectors(playerLocalPosition, playerPosition, true) < InteractionHelper.GetDistanceBetweenVectors(playerLocalPosition, tempObject.position, true)) tempObject = player;
      });
    } else {
      const objects = mp.objects.toArray();
      objects.forEach((object) => {
        const playerLocalPosition = mp.players.local.position;
        const objectPosition = object.position;
        const distance = InteractionHelper.GetDistanceBetweenVectors(playerLocalPosition, objectPosition, true);

        if (mp.players.local.dimension !== object.dimension && distance > InteractionHelper.range) return;
        if (tempObject === null) tempObject = object;
        if (InteractionHelper.GetDistanceBetweenVectors(playerLocalPosition, objectPosition, true) < InteractionHelper.GetDistanceBetweenVectors(playerLocalPosition, tempObject.position, true)) tempObject = object;
      });
    }

    return tempObject;
  }

  public static GetDistanceBetweenVectors(firstVector: Vector3Mp, secondVector: Vector3Mp, useZ: boolean): number {
    return mp.game.gameplay.getDistanceBetweenCoords(firstVector.x, firstVector.y, firstVector.z, secondVector.x, secondVector.y, secondVector.z, useZ);
  }
}