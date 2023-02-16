const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(24, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const color = new THREE.Color('hsl(1, 93%, 49%)')
const colorLight = new THREE.Color('hsl(40, 100%, 95%)')

//cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshPhongMaterial
(
    {
        color: color,
        shininess: 20,
    }
);
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

//light
const light = new THREE.PointLight(colorLight, 2);
const light2 = new THREE.PointLight(colorLight, .5);
const light3 = new THREE.PointLight(colorLight, 1);

light.position.set(-40,-20, 20);
light2.position.set(40, 20, 10);
light3.position.set(-10, 80, -40);

//add everything
scene.add(light);
scene.add(light2);
scene.add(light3);
scene.add(cube);


camera.position.z = 15;

cube.rotation.x = -10;

const animate = () => 
{
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.z += 0.01;
    renderer.render(scene, camera);
}

animate();