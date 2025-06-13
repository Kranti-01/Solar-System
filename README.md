# 3D Solar System Simulation with Three.js

This is a browser-based interactive 3D simulation of our solar system built using **Three.js**. It visually represents all 8 planets orbiting around the sun with realistic motion, rotation, textures, and lighting — all in real-time.

##  Features

-  All 8 planets with accurate relative sizes and distances
-  The Sun at the center with lighting effects
-  Realistic starfield background
-  Planetary orbits and self-rotation
-  Real-time speed control sliders for each planet
-  Fully responsive layout

##  Technologies Used

-  – for 3D rendering
- JavaScript, HTML, CSS
- Texture images for planets (stored in `/textures`)
## How It Works

- Each planet is placed inside a `THREE.Group` which rotates to simulate its orbit.
- Textures are loaded using `THREE.TextureLoader` (fallbacks to color if texture fails).
- Orbit speed is calculated using the orbital period and scaled for better visualization.
- The starfield background is created using `THREE.Points` and updated every frame.
- Sliders update the orbital speed in real-time for interactivity.


