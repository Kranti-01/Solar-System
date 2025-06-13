// --- Three.js Solar System with Speed Control ---

// Planet data: [name, color, distance from sun, size, orbital period (days)]
const PLANETS = [
  { name: 'Mercury', color: 0xb1b1b1, distance: 20, size: 1, period: 88 },
  { name: 'Venus',   color: 0xeccc9a, distance: 28, size: 1.5, period: 225 },
  { name: 'Earth',   color: 0x2a5cdd, distance: 36, size: 1.6, period: 365 },
  { name: 'Mars',    color: 0xc1440e, distance: 44, size: 1.2, period: 687 },
  { name: 'Jupiter', color: 0xd2b48c, distance: 60, size: 3.5, period: 4333 },
  { name: 'Saturn',  color: 0xf7e7b6, distance: 75, size: 3, period: 10759 },
  { name: 'Uranus',  color: 0x7fffd4, distance: 90, size: 2.5, period: 30687 },
  { name: 'Neptune', color: 0x4166f5, distance: 105, size: 2.4, period: 60190 },
];

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 40, 160);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);
const sunLight = new THREE.PointLight(0xffffff, 2, 0, 2);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// Texture file mapping for planets and Sun
const TEXTURE_MAP = {
  'Sun': 'sun.png',
  'Mercury': 'mercury.png',
  'Venus': 'venus.png',
  'Earth': 'earth.png',
  'Mars': 'mars.png',
  'Jupiter': 'jupiter.png',
  'Saturn': 'saturn.png',
  'Uranus': 'uranus.png',
  'Neptune': 'neptune.png',
};

// Preload textures
const loadedTextures = {};
for (const [name, file] of Object.entries(TEXTURE_MAP)) {
  loadedTextures[name] = new THREE.TextureLoader().load(file, undefined, undefined, () => {
    // On error, fallback to undefined (color will be used)
    loadedTextures[name] = undefined;
  });
}

// Planets
const planets = [];
const planetGroups = [];
const defaultSpeeds = {};
const currentSpeeds = {};

PLANETS.forEach((planet, i) => {
  // Orbit group for revolution
  const group = new THREE.Group();
  scene.add(group);
  planetGroups.push(group);

  // Planet mesh
  const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
  let material;
  if (loadedTextures[planet.name]) {
    material = new THREE.MeshStandardMaterial({ map: loadedTextures[planet.name] });
  } else {
    material = new THREE.MeshStandardMaterial({ color: planet.color });
  }
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = planet.distance;
  group.add(mesh);
  planets.push(mesh);

  // Store default and current speed (radians/sec)
  const speed = (2 * Math.PI) / (planet.period * 0.5); // Scaled for visualization
  defaultSpeeds[planet.name] = speed;
  currentSpeeds[planet.name] = speed;
});

// Control Panel
const slidersDiv = document.getElementById('sliders');
PLANETS.forEach((planet) => {
  const label = document.createElement('label');
  label.textContent = planet.name + ' Speed';
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = 0.1;
  slider.max = 3;
  slider.step = 0.01;
  slider.value = 1;
  slider.style.marginBottom = '8px';
  slider.addEventListener('input', (e) => {
    currentSpeeds[planet.name] = defaultSpeeds[planet.name] * parseFloat(slider.value);
  });
  slidersDiv.appendChild(label);
  slidersDiv.appendChild(slider);
});

// Animation
const clock = new THREE.Clock();
const planetAngles = PLANETS.map(() => Math.random() * Math.PI * 2); // random start

// Starfield background
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
const starVertices = [];
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = (Math.random() - 0.5) * 2000;
  starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Add Sun with yellow color (no texture)
const sunGeometry = new THREE.SphereGeometry(6, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xfff200 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  // Update star positions to fall towards the screen
  const positions = stars.geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 2] -= 10 * delta; // Move stars towards the screen
    if (positions[i + 2] < -1000) {
      positions[i + 2] = 1000; // Reset star position when it goes too far
    }
  }
  stars.geometry.attributes.position.needsUpdate = true;

  PLANETS.forEach((planet, i) => {
    planetAngles[i] += currentSpeeds[planet.name] * delta;
    const group = planetGroups[i];
    group.rotation.y = planetAngles[i];
    // Self-rotation
    planets[i].rotation.y += 0.02;
  });

  renderer.render(scene, camera);
}
animate();

// Responsive
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}); 