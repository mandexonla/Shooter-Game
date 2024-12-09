import * as pc from "playcanvas";

export class Sound {
  private app: pc.Application;
  private hitSoundEntity: pc.Entity;

  constructor(app: pc.Application) {
    this.app = app;
    this.hitSoundEntity = new pc.Entity();
    this.hitSoundEntity.addComponent("sound", {
      assets: [],
      volume: 1,
    });

    // Load sound
    this.app.assets.loadFromUrl(
      "Sound/shoot.mp3",
      "audio",
      // @ts-ignore
      (err, asset) => {
        if (err) {
          console.error("Error loading sound:", err);
          return;
        }
        this.hitSoundEntity.sound.addSlot("hit", {
          asset: asset,
          loop: false,
        });
      }
    );

    this.app.root.addChild(this.hitSoundEntity);
  }

  playSound() {
    this.hitSoundEntity.sound.play("hit");
  }
}
