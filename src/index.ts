import {
    WebGLRenderer, Scene, Mesh, TextureLoader, SphereBufferGeometry, MeshBasicMaterial, PerspectiveCamera,
    Vector3, Math as THREEMath
} from 'three';

let camera, scene, renderer;

let isUserInteracting = false;
let onMouseDownMouseX = 0;
let onMouseDownMouseY = 0;
let lon               = 0;
let onMouseDownLon    = 0;
let lat               = 0;
let onMouseDownLat    = 0;
let phi               = 0;
let theta             = 0;

init();
animate();

function init() {
    camera        = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
    camera.target = new Vector3(0, 0, 0);

    scene = new Scene();

    const geometry = new SphereBufferGeometry(500, 60, 40) as any;
    // invert the geometry on the x-axis so that all of the faces point inward
    geometry.scale(-1, 1, 1);

    const material = new MeshBasicMaterial({
        map: (new TextureLoader() as any).load(location.hash.slice(1))
    });

    scene.add(new Mesh(geometry, material));

    renderer = new WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('wheel', onDocumentMouseWheel, false);

    addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseDown(event) {

    event.preventDefault();

    isUserInteracting = true;

    onMouseDownMouseX = event.clientX;
    onMouseDownMouseY = event.clientY;

    onMouseDownLon = lon;
    onMouseDownLat = lat;

}

function onDocumentMouseMove(event) {
    if (isUserInteracting === true) {
        lon = (onMouseDownMouseX - event.clientX) * 0.1 + onMouseDownLon;
        lat = (event.clientY - onMouseDownMouseY) * 0.1 + onMouseDownLat;
    }
}

function onDocumentMouseUp() {
    isUserInteracting = false;
}

function onDocumentMouseWheel(event) {
    const fov  = camera.fov + event.deltaY * 0.05;
    camera.fov = THREEMath.clamp(fov, 10, 75);
    camera.updateProjectionMatrix();
}

function animate() {
    requestAnimationFrame(animate);
    update();
}

function update() {
    lat   = Math.max(-85, Math.min(85, lat));
    phi   = THREEMath.degToRad(90 - lat);
    theta = THREEMath.degToRad(lon);

    camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
    camera.target.y = 500 * Math.cos(phi);
    camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

    camera.lookAt(camera.target);

    renderer.render(scene, camera);
}
