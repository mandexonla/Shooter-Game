import * as pc from "playcanvas";

export class Spaceship {
  private app: pc.Application;
  private characterEntity: pc.Entity;

  constructor(app: pc.Application) {
    this.app = app;
    this.characterEntity = new pc.Entity("character");

    this.app.root.addChild(this.characterEntity);
    // app.on("update", (dt) => characterEntity.rotate(0, 100 * dt, 0));

    // Up load model 3D
    app.assets.loadFromUrl(
      "Models/1.glb",
      "model",
      // @ts-ignore
      (err, asset: pc.Asset | undefined) => {
        if (err) {
          console.log(err);
          return;
        }
        this.characterEntity.addComponent("model", {
          type: "asset",
          asset: asset,
        });
        this.characterEntity.setEulerAngles(115, 0, 115);
      }
    );
    const scale = 5;
    this.characterEntity.setLocalScale(scale, scale, scale);
    this.characterEntity.setPosition(0, -2, 0);

    // load character texture
    app.assets.loadFromUrl(
      "Textures/material_0_albedo.jpg",
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
        console.log(this.characterEntity.model);
        if (this.characterEntity.model) {
          this.characterEntity.model.meshInstances.forEach((meshInstance) => {
            meshInstance.material = material;
          });
        }
      }
    );
  }

  spaceShipMovement() {
    const moveSpeed = 10;
    // @ts-ignore
    this.app.keyboard = new pc.Keyboard(window);

    this.app.on("update", (dt) => {
      // move character
      if (this.app.keyboard.isPressed(pc.KEY_W)) {
        this.characterEntity.translate(0, moveSpeed * dt, 0);
      }
      if (this.app.keyboard.isPressed(pc.KEY_S)) {
        this.characterEntity.translate(0, -moveSpeed * dt, 0);
      }
      if (this.app.keyboard.isPressed(pc.KEY_D)) {
        this.characterEntity.translate(moveSpeed * dt, 0, 0);
      }
      if (this.app.keyboard.isPressed(pc.KEY_A)) {
        this.characterEntity.translate(-moveSpeed * dt, 0, 0);
      }
      // if (this.app.keyboard.isPressed(pc.KEY_SPACE)) {
      //   this.bullet.createBullet(this.app);
      // }
    });
  }
  getEntity() {
    return this.characterEntity;
  }
}
