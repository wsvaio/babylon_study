import * as BABYLON from "@babylonjs/core";
import "@babylonjs/inspector";

const URL = "https://playground.babylonjs.com/";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const engine = new BABYLON.Engine(canvas);

const scene = createScene();

engine.runRenderLoop(() => {
	scene.render();
});

addEventListener("resize", () => engine.resize());

function createScene() {
	const scene = new BABYLON.Scene(engine);

	const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2.5, 150, new BABYLON.Vector3(0, 60, 0));
	camera.upperBetaLimit = Math.PI / 2.2;
	camera.attachControl(canvas, true);
	const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

	const walk = function (turn, dist) {
		this.turn = turn;
		this.dist = dist;
	};

	const track = [];
	track.push(new walk(86, 7));
	track.push(new walk(-85, 14.8));
	track.push(new walk(-93, 16.5));
	track.push(new walk(48, 25.5));
	track.push(new walk(-112, 30.5));
	track.push(new walk(-72, 33.2));
	track.push(new walk(42, 37.5));
	track.push(new walk(-98, 45.2));
	track.push(new walk(0, 47));

	// Dude
	BABYLON.SceneLoader.ImportMeshAsync("him", `${URL}/scenes/Dude/`, "Dude.babylon", scene).then(result => {
		let dude = result.meshes[0];
		dude.scaling = new BABYLON.Vector3(0.008, 0.008, 0.008);

		dude.position = new BABYLON.Vector3(-6, 0, 0);
		dude.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(-95), BABYLON.Space.LOCAL);
		const startRotation = dude.rotationQuaternion.clone();

		camera.parent = dude;
		scene.beginAnimation(result.skeletons[0], 0, 100, true, 5.0);

		let distance = 0;
		let step = 0.015;
		let p = 0;

		scene.onBeforeRenderObservable.add(() => {
			dude.movePOV(0, 0, step);
			distance += step;

			if (distance > track[p].dist) {
				dude.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(track[p].turn), BABYLON.Space.LOCAL);
				p += 1;
				p %= track.length;
				if (p === 0) {
					distance = 0;
					dude.position = new BABYLON.Vector3(-6, 0, 0);
					dude.rotationQuaternion = startRotation.clone();
				}
			}
		});
	});

	const spriteManagerTrees = new BABYLON.SpriteManager(
		"treesManager",
		"textures/palm.png",
		2000,
		{ width: 512, height: 1024 },
		scene
	);

	// We create trees at random positions
	for (let i = 0; i < 500; i++) {
		const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
		tree.position.x = Math.random() * -30;
		tree.position.z = Math.random() * 20 + 8;
		tree.position.y = 0.5;
	}

	for (let i = 0; i < 500; i++) {
		const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
		tree.position.x = Math.random() * 25 + 7;
		tree.position.z = Math.random() * -35 + 8;
		tree.position.y = 0.5;
	}

	// Skybox
	const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 100 }, scene);
	const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(`${URL}textures/skybox`, scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skybox.material = skyboxMaterial;

	BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "valleyvillage.glb");
	return scene;
}
