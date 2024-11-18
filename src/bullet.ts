// import * as pc from "playcanvas";
// import { Spaceship } from "./spaceship";
// import { BulletManager } from "./bulletcollision";

// export class Bullet {
//   private app: pc.Application;

//   private speedBullet = 5;
//   private characterEntity: Spaceship;
//   private bulletManager: BulletManager;

//   constructor(app: pc.Application, characterEntity: Spaceship) {
//     this.app = app;
//     this.characterEntity = characterEntity;
//     this
//   }
//   createBullet(app: pc.Application) {
//     const bullet = new pc.Entity();
//     app.root.addChild(bullet);
//     app.assets.loadFromUrl(
//       "Models/bullet.glb",
//       "model",
//       // @ts-ignore
//       (err, asset: pc.Asset | undefined) => {
//         if (err) {
//           console.error(err);
//           return;
//         }
//         bullet.addComponent("model", {
//           type: "asset",
//           asset: asset,
//         });
//       }
//     );
//     app.assets.loadFromUrl(
//       "Textures/2.png",
//       "texture",
//       // @ts-ignore
//       (err, asset: pc.Asset | undefined) => {
//         if (err) {
//           console.error(err);
//           return;
//         }
//         const material = new pc.StandardMaterial();
//         // @ts-ignore
//         material.diffuseMap = asset?.resource;
//         material.update();
//         console.log(bullet.model);
//         if (bullet.model) {
//           bullet.model.meshInstances.forEach((meshInstance) => {
//             meshInstance.material = material;
//           });
//         }
//       }
//     );
//     bullet.setLocalScale(1, 1, 1);
//     const characterPosition = this.characterEntity
//       .getEntity()
//       .getPosition()
//       .clone();
//     bullet.setPosition(
//       characterPosition.x,
//       characterPosition.y,
//       characterPosition.z
//     );
//     app.root.addChild(bullet);
//     // @ts-ignore
//     this.bulletManager.push(bullet);
//   }
// }
