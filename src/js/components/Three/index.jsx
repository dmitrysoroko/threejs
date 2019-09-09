import React, { memo, useState, useRef, useEffect, useCallback } from "react";
import * as t from 'three';
import HealthImage from '../../../../assets/images/health.png'
import FloorImage from '../../../../assets/images/floor-1.jpg'
import Wall2Image from '../../../../assets/images/wall-2.jpg'
import Wall3Image from '../../../../assets/images/wall-3.jpg'

import './OrbitControls';
import './TransformControls';

const createMatrix = (w, h) => Array(h).fill(0).map(() => new Array(w).fill(0)),
    mapW = 10,
    mapH = 10,
    map = createMatrix(mapW, mapH),
    WIDTH = 1000,
    HEIGHT = 600,
    ASPECT = WIDTH / HEIGHT,
    UNITSIZE = 250,
    WALLHEIGHT = UNITSIZE / 3,
    scene = new t.Scene(),
    cam =  new t.PerspectiveCamera(60, ASPECT, 1, 10000),
    raycaster = new t.Raycaster();

const floorTexture = new t.TextureLoader().load(FloorImage);
const wallTexture1 = new t.TextureLoader().load(Wall3Image);
const wallTexture2 = new t.TextureLoader().load(Wall2Image);
const healthTexture = new t.TextureLoader().load(HealthImage);
const units = mapW;
const directionalLight1 = new t.DirectionalLight( 0xF7EFBE );
const directionalLight2 = new t.DirectionalLight( 0xF7EFBE );

const floor = new t.Mesh(
    new t.CubeGeometry(units * UNITSIZE, 10, units * UNITSIZE),
    new t.MeshLambertMaterial({ map: floorTexture })
);

const wallCube = new t.CubeGeometry(UNITSIZE, WALLHEIGHT, UNITSIZE);
const wallMaterials = [
    new t.MeshLambertMaterial({ map: wallTexture1 }),
    new t.MeshLambertMaterial({ map: wallTexture2 }),
];

const healthcube1 = new t.Mesh(
    new t.CubeGeometry(30, 30, 30),
    new t.MeshBasicMaterial({ map: healthTexture })
);

const healthcube2 = new t.Mesh(
    new t.CubeGeometry(30, 30, 30),
    new t.MeshBasicMaterial({ map: healthTexture })
);
const objects = [];
objects.push(healthcube1);
objects.push(healthcube2);

healthcube1.position.set(-UNITSIZE-15, 135, -UNITSIZE-15);
healthcube2.position.set(-UNITSIZE-15, 35, -UNITSIZE-15);

directionalLight1.position.set(0.5, 1, 0.5);
directionalLight2.position.set(-0.5, -1, -0.5);
cam.position.set(400, 200, 0);
const controls = new t.OrbitControls(cam);
controls.minDistance = 100;
controls.maxDistance = 2000;

setTimeout(() => {
    map.forEach((row, i) => row.forEach((el, j) => map[i][j] = Math.floor(Math.random() * 3)));
}, 1000);

function setupScene() {
    scene.add(floor);

    for (var i = 0; i < mapW; i++) {
        for (var j = 0, m = map[i].length; j < m; j++) {
            if (map[i][j]) {
                const wall = new t.Mesh(wallCube, wallMaterials[map[i][j]-1]);
                wall.position.x = (i - units/2) * UNITSIZE;
                wall.position.y = WALLHEIGHT/2;
                wall.position.z = (j - units/2) * UNITSIZE;
                wall.name = 'wall';
                scene.add(wall);
            }
        }
    }

    scene.add(healthcube1);
    scene.add(healthcube2);
    scene.add( directionalLight1 );
    scene.add( directionalLight2 );
}

function animate(renderer) {
    let selectedObject;
    while(selectedObject = scene.getObjectByName('wall'), selectedObject) {
        scene.remove(selectedObject);
    }
    requestAnimationFrame(() => animate(renderer));
    setupScene();

    renderer.render(scene, cam);
}

const ThreeJs = memo(() => {
    const canvas = useRef(null);
    const [controlItem, setControlItem] = useState(null);

    const pickObject = useCallback((event) => {
        const rect = canvas.current.getBoundingClientRect();
        const pos = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
        const pickPosition = {};
        pickPosition.x = (pos.x / canvas.current.clientWidth ) *  2 - 1;
        pickPosition.y = (pos.y / canvas.current.clientHeight) * -2 + 1;  // note we flip Y
        raycaster.setFromCamera(pickPosition, cam);
        const intersectedObjects = raycaster.intersectObjects(objects);
        if (intersectedObjects.length) {
            controlItem.attach( intersectedObjects[0].object );
        }
    }, [controlItem]);

    useEffect(() => {
        const renderer = new t.WebGLRenderer({ canvas: canvas.current });
        const controlItem = new t.TransformControls(cam, canvas.current);
        controlItem.addEventListener( 'dragging-changed', function ( event ) {
            controls.enabled = ! event.value;
        } );

        setControlItem(controlItem);

        scene.add( controlItem );
        renderer.setSize(WIDTH, HEIGHT);
        requestAnimationFrame(() => animate(renderer));
    }, []);

    return (
        <canvas onMouseDown={pickObject} ref={canvas}/>
    )
});

export default ThreeJs;
