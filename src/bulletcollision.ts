// import * as pc from "playcanvas";
// import { Spaceship } from "./spaceship";
// import { Box } from "./box";
// import { Collision } from "./collision";

// export class BulletManager {
//   bullets: pc.Entity[] = [];
//   score: number = 0;
//   scoreElement: HTMLElement;
//   app: pc.Application;
//   collision: Collision;
//   Box: Box;
//   ship: Spaceship;
//   speedBullet: number = 10;

//   constructor(
//     app: pc.Application,
//     scoreElement: HTMLElement,
//     collision: any,
//     Box: any,
//     ship: any
//   ) {
//     this.app = app;
//     this.scoreElement = scoreElement;
//     this.collision = collision;
//     this.Box = Box;
//     this.ship = ship;

//     this.app.on("update", this.update.bind(this));
//   }

//   handleBulletCollision(bullet: pc.Entity, box: any, i: number, j: number) {
//     // Remove bullet and box after collision
//     this.app.root.removeChild(Box.boxes[j]);
//     Box.boxes[j].destroy();
//     Box.boxes.splice(j, 1);

//     this.app.root.removeChild(bullet);
//     bullet.destroy();
//     this.bullets.splice(i, 1);

//     // Update score
//     this.score += 1;
//     this.scoreElement.innerText = `Score: ${this.score}`;
//   }

//   update(dt: number) {
//     // Update bullets
//     for (let i = this.bullets.length - 1; i >= 0; i--) {
//       const bullet = this.bullets[i];
//       bullet.translateLocal(0, this.speedBullet * dt, 0);
//       const position = bullet.getPosition();

//       // Check collision with boxes
//       for (let j = Box.boxes.length - 1; j >= 0; j--) {
//         if (this.collision.checkCollision(bullet, Box.boxes[j])) {
//           this.handleBulletCollision(bullet, Box.boxes[j], i, j);
//           break;
//         }
//       }

//       // Remove bullets that go out of bounds
//       if (position.y > 10) {
//         this.app.root.removeChild(bullet);
//         bullet.destroy();
//         this.bullets.splice(i, 1);
//       }
//     }

//     // Handle collision between box and spaceship
//     for (let i = Box.boxes.length - 1; i >= 0; i--) {
//       const box = Box.boxes[i];
//       if (box.isFalling) {
//         box.translate(0, -box.fallSpeed * dt, 0);
//         const boxPos = box.getPosition();
//         const shipPos = this.ship.getEntity().getPosition();
//         const distance = boxPos.distance(shipPos);

//         // If box collides with ship
//         if (distance < 1) {
//           console.log("Game Over");
//           location.reload();
//         }

//         // If box falls below a certain threshold
//         if (boxPos.y < -3) {
//           this.app.root.removeChild(box);
//           box.destroy();
//           Box.boxes.splice(i, 1);
//         }
//       }
//     }
//   }
// }
