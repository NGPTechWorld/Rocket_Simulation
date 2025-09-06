![image](https://github.com/user-attachments/assets/811dca08-8059-454a-ad2e-f9c8bd0d6297)
# Rocket Simulation 🚀

<div align="center">

<!-- Project status -->
![GitHub License](https://img.shields.io/github/license/NGPTechWorld/Rocket_Simulation)
![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-blue)
[![Live Demo](https://img.shields.io/badge/demo-online-green)](https://rocket-simulation-nhoka.vercel.app/)

---

<!-- Repo activity -->
![GitHub Stars](https://img.shields.io/github/stars/NGPTechWorld/Rocket_Simulation)
![GitHub Forks](https://img.shields.io/github/forks/NGPTechWorld/Rocket_Simulation)
![GitHub Watchers](https://img.shields.io/github/watchers/NGPTechWorld/Rocket_Simulation)
![GitHub Contributors](https://img.shields.io/github/contributors/NGPTechWorld/Rocket_Simulation)
![GitHub Last Commit](https://img.shields.io/github/last-commit/NGPTechWorld/Rocket_Simulation)

---

<!-- Repo details -->
![Repo Size](https://img.shields.io/github/repo-size/NGPTechWorld/Rocket_Simulation)
![Code Size](https://img.shields.io/github/languages/code-size/NGPTechWorld/Rocket_Simulation)
![Languages](https://img.shields.io/github/languages/count/NGPTechWorld/Rocket_Simulation)
![Open Issues](https://img.shields.io/github/issues/NGPTechWorld/Rocket_Simulation)
![Closed Issues](https://img.shields.io/github/issues-closed/NGPTechWorld/Rocket_Simulation)

---

<!-- Tech stack -->
![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-black?logo=three.js&logoColor=white)

</div>

![Project Screenshot](./screenshots/1.jpg)

Welcome to **Rocket Simulation**!, a real-time 3D rocket simulation developed to provide an immersive experience of rocket launches. Navigate using rocket model through realistic atmospheric and orbital environments, with physics-based controls that simulate thrust, drag, and gravity. Built with scientific accuracy in mind, this simulation leverages advanced aerodynamics and Newtonian physics to deliver a highly realistic rocket flight experience. 🌌

## Features 🌟

- **Real-time Rocket Simulation**: Launch rockets and control their flight in a fully interactive 3D environment. 🚀

- **Physics-Based Mechanics**: Includes thrust, drag, gravity, and fuel consumption for realistic flight behavior. 🌍

- **Comprehensive Control Panel**: Adjust thrust, gimbal angles, pitch, yaw, roll, and stage separation in real-time. ⚙️

- **Advanced Camera System**:

    * 🎯 Follow Camera: Tracks the rocket automatically.

    * 🔄 Orbit Camera: Rotate freely around the rocket.

    * 🎮 First-Person Camera: Fly with W, A, S, D keys.

- **3D Environment**:

    * 🌍 Earth Model and Launch Platform

    * ☀️🌙 Advanced Day-Night Lighting

    * 🪐 Atmospheric Layers (Troposphere, Stratosphere, Mesosphere/Thermosphere)

    * 🛰 Special Models (ITE Facutly Model, Custom Syrian Rocket Model)

- **Real-Time Data Display**: Shows speed, acceleration, mass, fuel level, thrust, and all acting forces.

- **Sound and Visual Effects**: Realistic rocket exhaust. 🔊

- **Vite Integration**: Fast development and build process. ⚡

## Scientific and Technical Insights 🔬

The simulation uses accurate physics principles and aerodynamics to model rocket flight:

1. **Rocket Mechanics**:

   - **Thrust Control**: Adjust rocket engine power to control ascent speed.
   - **Gravity and Drag**: Simulates realistic acceleration and atmospheric resistance.
   - **Thrust Dynamics**: Acceleration calculated based on mass, fuel, and gravity.

2. **Aerodynamics & Atmospheric Physics**:

   - Realistic air drag and atmospheric resistance.
   - Density changes through atmospheric layers affect flight.
   - Simulates terminal velocity, max Q, and re-entry forces.

3. **Collision Detection**:

   - Rockets cannot pass through terrain or launch pads.
   - Collision forces simulate crashes or impacts realistically.

4. **Environment Rendering**:
   - Earth, skyboxes, and space views with lighting and day-night cycles.
   - Dynamic visual effects during flight and launch.

## Screenshots 📸

<div style="display: flex; flex-wrap: wrap; gap: 5px; justify-content: center;">
    <img src="./screenshots/1.jpg" alt="Screenshot 2" width="200" height="100" style="border-radius: 8px;">
    <img src="./screenshots/2.jpg" alt="Screenshot 2" width="200" height="100" style="border-radius: 8px;">
    <img src="./screenshots/3.jpg" alt="Screenshot 3" width="200" height="100" style="border-radius: 8px;">
    <img src="./screenshots/4.jpg" alt="Screenshot 4" width="200" height="100" style="border-radius: 8px;">
    <img src="./screenshots/5.jpg" alt="Screenshot 5" width="200" height="100" style="border-radius: 8px;">
    <img src="./screenshots/6.jpg" alt="Screenshot 6" width="200" height="100" style="border-radius: 8px;">
    <img src="./screenshots/7.jpg" alt="Screenshot 7" width="200" height="100" style="border-radius: 8px;">
    <img src="./screenshots/8.jpg" alt="Screenshot 8" width="200" height="100" style="border-radius: 8px;">
    <img src="./screenshots/9.jpg" alt="Screenshot 9" width="200" height="100" style="border-radius: 8px;">
    <img src="./screenshots/10.jpg" alt="Screenshot 10" width="200" height="100" style="border-radius: 8px;">
    <img src="./screenshots/11.jpg" alt="Screenshot 11" width="200" height="100" style="border-radius: 8px;">
    <img src="./screenshots/12.jpg" alt="Screenshot 12" width="200" height="100" style="border-radius: 8px;">
</div>

## Demo Walkthrough 🚀

1. **Model**: Fly using Syrian Saturn V Model.
2. **User Interaction & GUI**:
   - Right GUI: Adjust rocket and environment parameters (fuel, mass, cross-sectional area, drag/lift coefficients, air density, gravity, etc...).
3. **Environment Interaction**:
   - Observe rocket through all atmospheric layers and into space.
4. **Real-Time Data**: View detailed data on rocket physics and environment data in a side panel.

## Technical Specifications ⚙️

- **Frontend**: Developed using **Three.js** for real-time 3D rendering. 🖼️
- **Bundler**: **Vite** provides fast and efficient build processes. ⚡

## Getting Started 🛠️

### Prerequisites

- **Node.js**: Make sure Node.js is installed.

### Installation
You can clone the repository using **two options**:
### Option A: Clone with models (full repository)
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/NGPTechWorld/Rocket_Simulation.git
   ```

2. **Navigate to the Project Directory**:

   ```bash
   cd Rocket_Simulation
   ```

3. **Install Dependencies**:

   ```bash
   npm install
   ```

4. **Run Locally**:

   ```bash
   npm run dev
   ```

   Open the application at [http://localhost:5173/](http://localhost:5173/).

### Option B: Clone without models (download models separately)
1. **Clone the Repository**:
   ```bash
   git clone --branch dev-without-models --single-branch --depth 1 https://github.com/NGPTechWorld/Rocket_Simulation.git
   ```
2. **Navigate to the Project Directory**:

   ```bash
   cd Rocket_Simulation
   ```
3. **Download the models separately from [here](https://t.me/c/2765126981/7)**.
4. **Extract the downloaded folder and it to the same level or src**:
   ![assets](./screenshots/assets.png)
5. **Install Dependencies**:

   ```bash
   npm install
   ```

6. **Run Locally**:

   ```bash
   npm run dev
   ```

   Open the application at [http://localhost:5173/](http://localhost:5173/).
   

### Build for Production

To create an optimized production build:

```bash
npm run build
```

## Live Demo 🌐

The project is also deployed and accessible online at [https://rocket-simulation-nhoka.vercel.app/](https://rocket-simulation-nhoka.vercel.app/).

## Report 📄

The full project report is available [here](https://t.me/c/2765126981/8). It includes detailed information about the physics, and technical design of the rocket simulation.

## Contributing 🤝

We welcome contributions! Here’s how you can contribute:

1. **Fork the repository**.
2. **Create a feature branch** (`git checkout -b feature-name`).
3. **Commit your changes** (`git commit -m 'Add new feature'`).
4. **Push to the branch** (`git push origin feature-name`).
5. **Open a pull request**.

## Contributors 👥
Thanks to all the amazing people who contributed to this project:

[![Hasan Zaeter](https://img.shields.io/badge/Hasan_Zaeter-UI-purpl?style=for-the-badge&logo=github)](https://github.com/HasanZaeter)

[![Mohamad Ali Alnuaimi](https://img.shields.io/badge/Mohamad_Ali_Alnuaimi-UI-purpl?style=for-the-badge&logo=github)](https://github.com/NGPTechWorld)

[![Osama Zerkawi](https://img.shields.io/badge/Osama_Zerkawi-Link-red?style=for-the-badge&logo=github)](https://github.com/OsamaZerkawi)

[![Kareem Bizreh](https://img.shields.io/badge/Kareem_Bizreh-Physics-blue?style=for-the-badge&logo=github)](https://github.com/Kareem-Bizreh)

[![OnlyAbdullh](https://img.shields.io/badge/Only_Abdullh-Physics-blue?style=for-the-badge&logo=github)](https://github.com/OnlyAbdullh)

## License 📜

This project is licensed under the **MIT License**.
