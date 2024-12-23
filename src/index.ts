import * as pc from "playcanvas";
import { Collision } from "./physics/collision";
import { Box } from "./Models/box";
import { SkyboxManager } from "./components/background";
import { Spaceship } from "./Models/spaceship";
import { Sound } from "./components/sound";

const collision = new Collision();
const box = new Box();

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
  const background = new SkyboxManager(app);

  const ship = new Spaceship(app);
  const soundManager = new Sound(app);

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

  // ========= ADD BOXES ============
  app.on("update", (dt) => {
    if (Box.boxes.length === 0) {
      Box.regenerateBoxes(app);
    }
  });

  // @ts-ignore
  app.keyboard = new pc.Keyboard(window);

  app.on("update", (dt) => {
    if (app.keyboard.isPressed(pc.KEY_SPACE)) {
      createBullet();
    }
  });
  ship.spaceShipMovement();

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
    const characterPosition = ship.getEntity().getPosition().clone();
    bullet.setPosition(
      characterPosition.x,
      characterPosition.y,
      characterPosition.z
    );
    app.root.addChild(bullet);
    // @ts-ignore
    bullets.push(bullet);
  }

  const hitSoundEntity = new pc.Entity();
  hitSoundEntity.addComponent("sound", {
    assets: [],
    volume: 1,
  });

  //=========ADD SCORE ============
  let score = 0;
  const scoreElement = document.createElement("div");
  scoreElement.style.position = "absolute";
  scoreElement.style.top = "20px";
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
    soundManager.playSound();

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
        const shipPos = ship.getEntity().getPosition();
        // @ts-ignore
        const distance = boxPos.distance(shipPos);

        //if box collision with ship
        if (distance < 1) {
          console.log("Game Over");
          // Show pop-up
          const popup = document.createElement("div");
          popup.style.position = "fixed";
          popup.style.top = "50%";
          popup.style.left = "50%";
          popup.style.transform = "translate(-50%, -50%)";
          popup.style.width = "300px";
          popup.style.height = "150px";
          popup.style.background = "white";
          popup.style.border = "1px solid #ccc";
          popup.style.borderRadius = "5px";
          popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
          popup.style.padding = "20px";
          popup.style.zIndex = "1000";
          popup.innerHTML = `
            <h2>Game Over</h2>
            <p>You lost! Try again?</p>
            <button id="restart-button">Restart Game</button>
          `;
          document.body.appendChild(popup);

          // Handle restart game
          const restartButton = document.getElementById("restart-button");
          if (restartButton) {
            restartButton.addEventListener("click", () => {
              window.location.reload();
            });
          }
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
  background.init();
}
document.getElementById("start-button")?.addEventListener("click", () => {
  const container = document.getElementById("start-screen");
  if (container) {
    container.style.display = "none";
  }
  initializeGame();
});
