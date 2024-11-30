import * as pc from "playcanvas";
// text
export class Background {
  constructor() {}
  setupSkybox(app) {
    app.assets.loadFromUrl(
      "Textures/test1.dds",
      "texture",
      (error, asset: pc.Asset) => {
        const texture = asset.resource;
        (<any>texture).rgbm = true;

        app.setSkybox(asset);

        //@ts-ignore
        texture.magFilter = pc.FILTER_LINEAR;
        //@ts-ignore
        texture.minFilter = pc.FILTER_LINEAR_MIPMAP_LINEAR;
        //@ts-ignore
        texture.anisotropy = 16;
        console.log(error);
        return null;
      }
    );
  }
}
