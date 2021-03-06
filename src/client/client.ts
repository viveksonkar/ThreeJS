import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import { interval } from 'rxjs';
import { tap } from 'rxjs/operators';

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const light = new THREE.PointLight()
light.position.set(0.8, 1.4, 1.0)
scene.add(light)

const ambientLight = new THREE.AmbientLight()
scene.add(ambientLight)

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(0.8, 1.4, 1.0)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 1, 0)

var targetObj: THREE.Group;
createInputField();

//const material = new THREE.MeshNormalMaterial()

const fbxLoader = new FBXLoader()
fbxLoader.load(
    'models/conveyor.fbx',
    (object) => {
        // object.traverse(function (child) {
        //     if ((child as THREE.Mesh).isMesh) {
        //         // (child as THREE.Mesh).material = material
        //         if ((child as THREE.Mesh).material) {
        //             ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
        //         }
        //     }
        // })
        // object.scale.set(.01, .01, .01)
        scene.add(object);
        targetObj = object;


        const gui = new GUI()
        const cubeFolder = gui.addFolder('Cube')
        cubeFolder.add(object.rotation, 'x', 0, Math.PI * 2)
        cubeFolder.add(object.rotation, 'y', 0, Math.PI * 2)
        cubeFolder.add(object.rotation, 'z', 0, Math.PI * 2)
        cubeFolder.open()
        const cameraFolder = gui.addFolder('Camera')
        cameraFolder.add(camera.position, 'z', 0, 10)
        cameraFolder.open()
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        rotate();
    },
    (error) => {
        console.log(error)
    }
)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = Stats()
document.body.appendChild(stats.dom)

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

function createInputField() {
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    document.body.appendChild(input);

    input.addEventListener('input', updateValue);

    input.style.height =  '30px';
    input.style.width = '250px';
    input.style.position = 'absolute';
    input.style.background = 'white';
    input.style.top = '0';
}

function updateValue(e: any) {
    console.log("Input field Value => ", e.target.value);
    targetObj.rotation.x = e.target.value;
    let intialRotation = 0;
    interval(300).pipe(
        tap( sec => {
            intialRotation += 50;
            console.log("intialRotation => ", intialRotation);
            targetObj.rotation.x = intialRotation;
        })
    )
}

function rotate() {
    let intialRotation = 0;
    interval(300).pipe(
        tap( sec => {
            intialRotation += 50;
            console.log("intialRotation => ", intialRotation);
            targetObj.rotation.x = intialRotation;
        })
    ).subscribe();
}

animate()