import * as pc from "playcanvas";

interface CustomBox extends pc.Entity {
  isFalling: boolean;
  fallDelay: number;
  fallSpeed: number;
}

window.onload = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 300;
  document.body.appendChild(canvas);

  // create a PlayCanvas application with the canvas
  const app = new pc.Application(canvas);

  //start app
  app.start();
  // setInterval(() => {createBullet()},50)

  //create camera entity
  const cameraEntity = new pc.Entity("MainCamera");

  //add camera entity

  app.root.addChild(cameraEntity);

  cameraEntity.addComponent("camera", {
    clearColor: new pc.Color(66 / 225, 135 / 255, 245 / 255),
  });
  //set camera position
  cameraEntity.setPosition(0, 0, 10);

  // ========= ADD A BOX ================
  const numberOfBox = 30;
  const boxes: CustomBox[] = [];

  function regenerateBoxes() {
    for (let i = 0; i < numberOfBox; i++) {
      const box = new pc.Entity() as CustomBox;
      app.root.addChild(box);

      // Load 3D model for the box
      app.assets.loadFromUrl(
        "../Shooter/Assets/Models/comet.glb",
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

          // Set scale and position for the box
          const scale = 0.05;
          box.setLocalScale(scale, scale, scale);

          const randomX = Math.random() * 6 - 3;
          const randomY = Math.random() * 3 + 1;
          box.setPosition(randomX, randomY, 0);

          app.on("update", (dt) => box.rotate(20 * dt, 20 * dt, 20 * dt));

          // Load texture for the box
          app.assets.loadFromUrl(
            "../Shooter/Assets/Textures/1.png",
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
          // Add attribute isFalling, fallDelay in box
          box.isFalling = false;
          box.fallDelay = 3000 + i * 500;
          box.fallSpeed = 3;
          setTimeout(() => {
            box.isFalling = true;
          }, box.fallDelay);
          boxes.push(box);
        }
      );
    }
  }

  app.on("update", (dt) => {
    if (boxes.length === 0) {
      regenerateBoxes();
    }
  });

  // ========= ADD A SPACE SHIP ============
  const characterEntity = new pc.Entity("character");
  app.root.addChild(characterEntity);
  // app.on("update", (dt) => characterEntity.rotate(0, 100 * dt, 0));

  // Up load model 3D
  app.assets.loadFromUrl(
    "../Shooter/Assets/Models/1.glb",
    "model",
    // @ts-ignore
    (err, asset: pc.Asset | undefined) => {
      if (err) {
        console.log(err);
        return;
      }
      characterEntity.addComponent("model", {
        type: "asset",
        asset: asset,
      });
      characterEntity.setEulerAngles(115, 0, 115);
    }
  );
  const scale = 5;
  characterEntity.setLocalScale(scale, scale, scale);
  characterEntity.setPosition(0, -2, 0);

  // load character texture
  app.assets.loadFromUrl(
    "../Shooter/Assets/Textures/material_0_albedo.jpg",
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
      console.log(characterEntity.model);
      if (characterEntity.model) {
        characterEntity.model.meshInstances.forEach((meshInstance) => {
          meshInstance.material = material;
        });
      }
    }
  );

  // ======= ADD LIGHT =========
  const light = new pc.Entity("DirectionalLight");
  app.root.addChild(light);
  light.addComponent("light", {
    type: pc.LIGHTTYPE_DIRECTIONAL,
    color: new pc.Color(1, 1, 1),
    intensity: 1,
  });
  light.setLocalEulerAngles(45, 0, 0);
  app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
  app.setCanvasResolution(pc.RESOLUTION_AUTO);
  window.addEventListener("resize", () => app.resizeCanvas());

  // ====== HANDLE MOVEMENT ======
  const moveSpeed = 10;
  // @ts-ignore
  app.keyboard = new pc.Keyboard(window);

  app.on("update", (dt) => {
    // Di chuyển nhân vật
    if (app.keyboard.isPressed(pc.KEY_W)) {
      characterEntity.translate(0, moveSpeed * dt, 0);
    }
    if (app.keyboard.isPressed(pc.KEY_S)) {
      characterEntity.translate(0, -moveSpeed * dt, 0);
    }
    if (app.keyboard.isPressed(pc.KEY_D)) {
      characterEntity.translate(moveSpeed * dt, 0, 0);
    }
    if (app.keyboard.isPressed(pc.KEY_A)) {
      characterEntity.translate(-moveSpeed * dt, 0, 0);
    }
    if (app.keyboard.isPressed(pc.KEY_SPACE)) {
      createBullet();
    }
  });

  //========= add bullet ============
  const bullets: pc.Entity[] = [];
  const speedBullet = 5;

  function createBullet() {
    const bullet = new pc.Entity();
    app.root.addChild(bullet);
    app.assets.loadFromUrl(
      "../Shooter/Assets/Models/bullet.glb",
      "model",
      // @ts-ignore
      (err, asset: pc.Asset | undefined) => {
        if (err) {
          console.error(err);
          return;
        }
        bullet.addComponent("model", {
          type: "asset",
          asset: asset,
        });
      }
    );
    app.assets.loadFromUrl(
      "../Shooter/Assets/Textures/2.png",
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
        console.log(bullet.model);
        if (bullet.model) {
          bullet.model.meshInstances.forEach((meshInstance) => {
            meshInstance.material = material;
          });
        }
      }
    );
    bullet.setLocalScale(1, 1, 1);
    const characterPosition = characterEntity.getPosition().clone();
    bullet.setPosition(
      characterPosition.x,
      characterPosition.y,
      characterPosition.z
    );
    app.root.addChild(bullet);
    // @ts-ignore
    bullets.push(bullet);
  }

  app.on("update", (dt) => {
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      //@ts-ignore
      bullet.translateLocal(0, speedBullet * dt, 0);
      // @ts-ignore
      const position = bullet.getPosition();

      // Check collision with boxes
      for (let j = boxes.length - 1; j >= 0; j--) {
        if (checkCollision(bullet, boxes[j])) {
          // Handle bullet
          app.root.removeChild(boxes[j]);
          boxes[j].destroy();
          boxes.splice(j, 1);
          app.root.removeChild(bullet);
          // @ts-ignore
          bullet.destroy();
          bullets.splice(i, 1);
          break;
        }
      }
      if (position.y > 10) {
        app.root.removeChild(bullet);
        // @ts-ignore
        bullet.destroy();
        bullets.splice(i, 1);
      }
    }
    // Handle collision between box with spaceship
    for (let i = boxes.length - 1; i >= 0; i--) {
      const box = boxes[i];
      if (box.isFalling) {
        box.translate(0, -box.fallSpeed * dt, 0);
        const boxPos = box.getPosition();
        const shipPos = characterEntity.getPosition();
        const distance = boxPos.distance(shipPos);

        //if box collision with ship
        if (distance < 1) {
          alert("Game Over");
          location.reload();
        }
        //if box fall to low(below ship)
        if (boxPos.y < -3) {
          app.root.removeChild(box);
          box.destroy();
          boxes.splice(i, 1);
        }
      }
    }
  });

  // Check collision
  function checkCollision(bullet: pc.Entity, box: pc.Entity): boolean {
    const bulletPos = bullet.getPosition();
    const boxPos = box.getPosition();
    // Calculate distance between bullet and box
    // @ts-ignore
    const distance = bulletPos.distance(boxPos);
    // Define a threshold for collision detection
    const collisionThreshold = 0.5;
    return distance < collisionThreshold;
  }
};
