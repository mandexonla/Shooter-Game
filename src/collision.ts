import * as pc from "playcanvas";
export class Collision {
  constructor() {}
  checkCollision(bullet: pc.Entity, box: pc.Entity): boolean {
    const bulletPos = bullet.getPosition();
    const boxPos = box.getPosition();
    // Calculate distance between bullet and box
    // @ts-ignore
    const distance = bulletPos.distance(boxPos);
    // Define a threshold for collision detection
    const collisionThreshold = 0.5;
    return distance < collisionThreshold;
  }
}
