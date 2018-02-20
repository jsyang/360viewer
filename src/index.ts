import {
    WebGLRenderer, Scene, Mesh, TextureLoader,
    Texture, SphereBufferGeometry, MeshBasicMaterial,
    PerspectiveCamera, Vector3, Math as THREEMath
} from 'three';

let camera, scene, renderer;

let isUserInteracting = false;
let lastClientX       = 0;
let lastClientY       = 0;
let lon               = 0;
let lastLon           = 0;
let lat               = 0;
let lastLat           = 0;
let phi               = 0;
let theta             = 0;

let material;

const textureLoader: any = new TextureLoader();

init();
animate();

function init() {
    camera        = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
    camera.target = new Vector3(0, 0, 0);

    scene = new Scene();

    const geometry = new SphereBufferGeometry(500, 60, 40) as any;
    // invert the geometry on the x-axis so that all of the faces point inward
    geometry.scale(-1, 1, 1);

    material = new MeshBasicMaterial({map: new Texture(new Image())});
    loadTexture();
    scene.add(new Mesh(geometry, material));

    renderer = new WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    addEventListener('hashchange', loadTexture);
    addEventListener('mousedown', onMouseDown);
    addEventListener('touchstart', onMouseDown);
    addEventListener('mousemove', onMouseMove);
    addEventListener('touchmove', onMouseMove);
    addEventListener('touchend', onMouseUp);
    addEventListener('mouseup', onMouseUp);
    addEventListener('wheel', onMouseWheel);

    addEventListener('resize', onResize);
}

function loadTexture() {
    textureLoader.load(
        location.hash.slice(1),
        onLoadTexture,
        null,
        onErrorTexture
    );

    document.body.classList.add('spinner');
}

function onLoadTexture(texture) {
    material.map.image       = texture.image;
    material.map.needsUpdate = true;
    document.body.classList.remove('spinner');
}

function onErrorTexture() {
    alert(`There was an issue loading ${location.hash.slice(1)}.`);
    document.body.classList.remove('spinner');
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseDown(event) {
    event.preventDefault();
    isUserInteracting = true;

    const {touches, clientX, clientY} = event;

    if (touches) {
        lastClientX = touches[0].clientX;
        lastClientY = touches[0].clientY;
    } else {
        lastClientX = clientX;
        lastClientY = clientY;
    }

    lastLon = lon;
    lastLat = lat;
}

function onMouseMove({clientX, clientY, touches}: any) {
    if (isUserInteracting === true) {
        if (touches) {
            clientX = touches[0].clientX;
            clientY = touches[0].clientY;
        }

        lon = (lastClientX - clientX) * 0.1 + lastLon;
        lat = -(lastClientY - clientY) * 0.1 + lastLat;
    }
}

function onMouseUp() {
    isUserInteracting = false;
}

function onMouseWheel(event) {
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
