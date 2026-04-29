import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Scene } from "@babylonjs/core/scene";

export function createScene(engine: Engine): Scene {
  const scene = new Scene(engine);
  scene.clearColor.set(0, 0, 0, 1);

  const camera = new FreeCamera("main-camera", new Vector3(0, 0, -12), scene);
  camera.setTarget(new Vector3(0, 0, 20));
  camera.fov = 0.85;
  camera.minZ = 0.1;
  camera.maxZ = 160;
  camera.attachControl(false);
  scene.activeCamera = camera;

  const ambient = new HemisphericLight("ambient-light", new Vector3(0, 1, 0), scene);
  ambient.intensity = 0.65;
  ambient.diffuse = new Color3(0.55, 0.7, 1);

  const keyLight = new DirectionalLight("key-light", new Vector3(-0.4, -0.6, 1), scene);
  keyLight.intensity = 1.2;

  return scene;
}
