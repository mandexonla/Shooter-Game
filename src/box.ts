import * as pc from "playcanvas";
interface CustomBox extends pc.Entity {
  isFalling: boolean;
  fallDelay: number;
  fallSpeed: number;
}
export class Box {
  static numberOfBox = 30;
  static boxes: CustomBox[] = [];

  static regenerateBoxes(app: pc.Application) {
    for (let i = 0; i < this.numberOfBox; i++) {
      const box = new pc.Entity() as CustomBox;
      app.root.addChild(box);

      // Load 3D model for the box
      app.assets.loadFromUrl(
        "Models/comet.glb",
        "model",
        // @ts-ignore
        (err, asset: pc.Asset | undefined) => {
          if (err) {
            console.error(err);
            return;
          }
          box.addComponent("model", {
            type: "asset",
            asset: asset,
          });
          // Setting scale and position for the box
          const scale = 0.05;
          box.setLocalScale(scale, scale, scale);
          const randomX = Math.random() * 6 - 3;
          const randomY = Math.random() * 3 + 1;
          box.setPosition(randomX, randomY, 0);

          //  Rotate box
          app.on("update", (dt) => box.rotate(20 * dt, 20 * dt, 20 * dt));

          // Load texture cho box
          app.assets.loadFromUrl(
            "Textures/1.png",
            "texture",
            // @ts-ignore
            (err, asset: pc.Asset | undefined) => {
              if (err) {
                console.error(err);
                return;
              }
              const material = new pc.StandardMaterial();
              // @ts-ignore
              material.diffuseMap = asset?.resource;
              material.update();
              if (box.model) {
                box.model.meshInstances.forEach((meshInstance) => {
                  meshInstance.material = material;
                });
              }
            }
          );

          // Set falling effect for the box
          box.isFalling = false;
          box.fallDelay = 3000 + i * 500;
          box.fallSpeed = 3;
          setTimeout(() => {
            box.isFalling = true;
          }, box.fallDelay);
          this.boxes.push(box);
        }
      );
    }
  }
}
