const mapW = 10,
	mapH = 10,
	map = Array(mapW).fill(Array(mapH).fill(0)),
	WIDTH = window.innerWidth,
	HEIGHT = window.innerHeight,
	ASPECT = WIDTH / HEIGHT,
	UNITSIZE = 250,
	WALLHEIGHT = UNITSIZE / 3,
	t = THREE,
	scene = new t.Scene(),
	cam =  new t.PerspectiveCamera(60, ASPECT, 1, 10000),
	renderer = new t.WebGLRenderer();

const floorTexture = new t.TextureLoader().load( 'images/floor-1.jpg');
const wallTexture1 = new t.TextureLoader().load( 'images/wall-1.jpg');
const wallTexture2 = new t.TextureLoader().load( 'images/wall-2.jpg');
const healthTexture = new t.TextureLoader().load( 'images/health.png');
const units = mapW;

const floor = new t.Mesh(
	new t.CubeGeometry(units * UNITSIZE, 10, units * UNITSIZE),
	new t.MeshLambertMaterial({ map: floorTexture })
);

const wallCube = new t.CubeGeometry(UNITSIZE, WALLHEIGHT, UNITSIZE);
const wallMaterials = [
	new t.MeshLambertMaterial({ map: wallTexture1 }),
	new t.MeshLambertMaterial({ map: wallTexture2 }),
];

const healthcube = new t.Mesh(
	new t.CubeGeometry(30, 30, 30),
	new t.MeshBasicMaterial({ map: healthTexture })
);
healthcube.position.set(-UNITSIZE-15, 35, -UNITSIZE-15);
const directionalLight1 = new t.DirectionalLight( 0xF7EFBE );
const directionalLight2 = new t.DirectionalLight( 0xF7EFBE );
directionalLight1.position.set( 0.5, 1, 0.5 );
directionalLight2.position.set( -0.5, -1, -0.5 );

cam.position.set( 400, 200, 0 );
const controls = new t.OrbitControls(cam);
controls.minDistance = 100;
controls.maxDistance = 500;

renderer.setSize(WIDTH, HEIGHT);
document.body.appendChild(renderer.domElement);

const setupScene = () => {
	scene.add(floor);

	for (var i = 0; i < mapW; i++) {
		for (var j = 0, m = map[i].length; j < m; j++) {
			if (map[i][j]) {
				const wall = new t.Mesh(wallCube, wallMaterials[map[i][j]-1]);
				wall.position.x = (i - units/2) * UNITSIZE;
				wall.position.y = WALLHEIGHT/2;
				wall.position.z = (j - units/2) * UNITSIZE;
				scene.add(wall);
			}
		}
	}

	scene.add(healthcube);
	scene.add( directionalLight1 );
	scene.add( directionalLight2 );
};

setupScene();

setInterval(() => {
	map.forEach(row => {
		row.forEach(el => {
			el = Math.floor(Math.random() * 2)
		})
	})
},1000);



const animate = () => {
	requestAnimationFrame(animate);

	renderer.clear();
	renderer.render(scene, cam);
};

animate();



