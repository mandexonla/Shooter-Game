import * as pc from "playcanvas";
import { Collision } from "./collision";
import { Box } from "./box";
import { Background } from "./background";

const collision = new Collision();
const box = new Box();
const background = new Background();

document.getElementById("start-button")?.addEventListener("click", () => {
  const container = document.getElementById("start-screen");
  if (container) {
    container.style.display = "none";
  }
});

interface CustomBox extends pc.Entity {
  isFalling: boolean;
  fallDelay: number;
  fallSpeed: number;
}

function initializeGame() {
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

  // ========= ADD BOXES ============
  app.on("update", (dt) => {
    if (Box.boxes.length === 0) {
      Box.regenerateBoxes(app);
    }
  });

  // ========= ADD A SPACE SHIP ============
  const characterEntity = new pc.Entity("character");
  app.root.addChild(characterEntity);
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
    // move character
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
      "Models/bullet.glb",
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
      "Textures/2.png",
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

  //=========ADD SCORE ============
  let score = 0;
  const scoreElement = document.createElement("div");
  scoreElement.style.position = "absolute";
  scoreElement.style.top = "10px";
  scoreElement.style.right = "10px";
  scoreElement.style.fontFamily = "'Press Start 2P', cursive";
  scoreElement.style.fontSize = "16px";
  scoreElement.style.color = "white";
  scoreElement.innerText = `Score: ${score}`;
  document.body.appendChild(scoreElement);

  // Update score when bullet hit box
  function handleBulletCollision(
    bullet: pc.Entity,
    box: CustomBox,
    i: number,
    j: number
  ) {
    // Remove bullet and box after collision
    app.root.removeChild(Box.boxes[j]);
    Box.boxes[j].destroy();
    Box.boxes.splice(j, 1);
    app.root.removeChild(bullet);
    bullet.destroy();
    bullets.splice(i, 1);

    // Update score
    score += 1;
    scoreElement.innerText = `Score: ${score}`;
  }
  app.on("update", (dt) => {
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      //@ts-ignore
      bullet.translateLocal(0, speedBullet * dt, 0);
      // @ts-ignore
      const position = bullet.getPosition();

      // Check collision with boxes
      for (let j = Box.boxes.length - 1; j >= 0; j--) {
        if (collision.checkCollision(bullet, Box.boxes[j])) {
          handleBulletCollision(bullet, Box.boxes[j], i, j);
          break;
        }
        if (collision.checkCollision(bullet, Box.boxes[j])) {
          // Handle bullet
          app.root.removeChild(Box.boxes[j]);
          Box.boxes[j].destroy();
          Box.boxes.splice(j, 1);
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
    for (let i = Box.boxes.length - 1; i >= 0; i--) {
      const box = Box.boxes[i];
      if (box.isFalling) {
        box.translate(0, -box.fallSpeed * dt, 0);
        const boxPos = box.getPosition();
        const shipPos = characterEntity.getPosition();
        // @ts-ignore
        const distance = boxPos.distance(shipPos);

        //if box collision with ship
        if (distance < 1) {
          console.log("Game Over");
          // alert("Game Over");
          location.reload();
        }
        //if box fall to low(below ship)
        if (boxPos.y < -3) {
          app.root.removeChild(box);
          box.destroy();
          Box.boxes.splice(i, 1);
        }
      }
    }
  });
  background.setupSkybox(app);
}
document.getElementById("start-button")?.addEventListener("click", () => {
  const container = document.getElementById("start-screen");
  if (container) {
    container.style.display = "none";
  }
  initializeGame();
});
