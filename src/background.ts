import * as pc from "playcanvas";

export class SkyboxManager {
  private app: pc.Application;
  private cubemapAsset: pc.Asset = new pc.Asset(
    "TextureSkybox",
    "cubemap",
    {
      url: "Assets/Skybox/206028223/MilkywayCubemap.dds",
    },
    {
      textures: [
        "assets/Skybox/206028224/Milkyway_posz.png",
        "assets/Skybox/206028225/Milkyway_posy.png",
        "assets/Skybox/206028226/Milkyway_posx.png",
        "assets/Skybox/206028227/Milkyway_negz.png",
        "assets/Skybox/206028228/Milkyway_negy.png",
        "assets/Skybox/206028229/Milkyway_negx.png",
      ],
      name: "New Cubemap",
      minFilter: 5,
      magFilter: 1,
      anisotropy: 1,
      rgbm: true,
      prefiltered: "MilkywayCubemap.dds",
    }
  );

  constructor(app: pc.Application) {
    this.app = app;
  }

  public init() {
    this.app.setSkybox(this.cubemapAsset);
  }
}
