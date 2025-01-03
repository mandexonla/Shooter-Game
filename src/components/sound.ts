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
    //background sound
    //   this.initializeIndexSound = new pc.Entity();
    //   this.initializeIndexSound.addComponent("sound", {
    //     assets: [],
    //     volume: 1,
    //   });
    //   this.app.assets.loadFromUrl(
    //     "Sound/home.mp3",
    //     "audio",
    //     // @ts-ignore
    //     (err, asset) => {
    //       if (err) {
    //         console.error("Error loading sound:", err);
    //         return;
    //       }
    //       this.initializeIndexSound.sound.addSlot("background", {
    //         asset: asset,
    //         loop: false,
    //       });
    //     }
    //   );
    //   this.app.root.addChild(this.initializeIndexSound);
  }

  playSound() {
    this.hitSoundEntity.sound.play("hit");
  }
  // playIndexSound() {
  //   this.initializeIndexSound.sound.play("background");
  // }

  initializeIndexSound() {
    const indexSoundEntity = new pc.Entity();
    indexSoundEntity.addComponent("sound", {
      assets: [],
      volume: 1,
    });

    // Load sound for index screen
    this.app.assets.loadFromUrl(
      "Sound/home.mp3",
      "audio",
      // @ts-ignore
      (err, asset) => {
        if (err) {
          console.error("Error loading index sound:", err);
          return;
        }
        indexSoundEntity.sound.addSlot("background", {
          asset: asset,
          loop: false,
          autoPlay: true,
        });
        this.app.root.addChild(indexSoundEntity);
      }
    );
  }
}
