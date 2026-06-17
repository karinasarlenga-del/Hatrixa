import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

export function initHero3D() {
  const container = document.getElementById('hero-container');
  const canvas = document.getElementById('hero-canvas');
  if (!container || !canvas) return;

  const totalSections = 3;
  const sections = [
    document.getElementById('hero-content-0'),
    document.getElementById('hero-content-1'),
    document.getElementById('hero-content-2'),
  ];
  const progressFill = document.getElementById('progress-fill');
  const sectionCounter = document.getElementById('section-counter');

  // Utility to split text into characters for GSAP animation
  const splitText = (element) => {
    const text = element.innerText;
    element.innerHTML = '';
    text.split('').forEach(char => {
      const span = document.createElement('span');
      span.className = 'title-char inline-block';
      // keep spaces intact
      if(char === ' ') {
        span.innerHTML = '&nbsp;';
      } else {
        span.innerText = char;
      }
      element.appendChild(span);
    });
  };

  sections.forEach(sec => {
    if(sec) {
      const h1 = sec.querySelector('h1');
      if(h1) splitText(h1);
    }
  });

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.00025);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(0, 20, 100);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.8, 0.4, 0.85);
  composer.addPass(bloomPass);

  const starsList = [];
  const createStarField = () => {
    const starCount = 5000;
    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);
      const sizes = new Float32Array(starCount);

      for (let j = 0; j < starCount; j++) {
        const radius = 200 + Math.random() * 800;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[j * 3 + 2] = radius * Math.cos(phi);

        // Monochromatic color variation
        const color = new THREE.Color();
        const brightness = 0.4 + Math.random() * 0.6; 
        color.setHSL(0, 0, brightness); // purely grayscale

        colors[j * 3] = color.r;
        colors[j * 3 + 1] = color.g;
        colors[j * 3 + 2] = color.b;
        sizes[j] = Math.random() * 2 + 0.5;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 }, depth: { value: i } },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          uniform float time;
          uniform float depth;
          void main() {
            vColor = color;
            vec3 pos = position;
            float angle = time * 0.05 * (1.0 - depth * 0.3);
            mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
            pos.xy = rot * pos.xy;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
            gl_FragColor = vec4(vColor, opacity);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const stars = new THREE.Points(geometry, material);
      scene.add(stars);
      starsList.push(stars);
    }
  };

  let nebula;
  const createNebula = () => {
    const geometry = new THREE.PlaneGeometry(8000, 4000, 100, 100);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        // Monochromatic soft grayscale
        color1: { value: new THREE.Color(0x333333) }, 
        color2: { value: new THREE.Color(0x111111) }, 
        opacity: { value: 0.3 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying float vElevation;
        uniform float time;
        void main() {
          vUv = uv;
          vec3 pos = position;
          float elevation = sin(pos.x * 0.01 + time) * cos(pos.y * 0.01 + time) * 20.0;
          pos.z += elevation;
          vElevation = elevation;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        uniform float opacity;
        uniform float time;
        varying vec2 vUv;
        varying float vElevation;
        void main() {
          float mixFactor = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time);
          vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
          float alpha = opacity * (1.0 - length(vUv - 0.5) * 2.0);
          alpha *= 1.0 + vElevation * 0.01;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    nebula = new THREE.Mesh(geometry, material);
    nebula.position.z = -1050;
    nebula.rotation.x = 0;
    scene.add(nebula);
  };

  const mountainsList = [];
  const mountainLocations = [];
  const createMountains = () => {
    // Grayscale palette for mountains
    const layers = [
      { distance: -50, height: 60, color: 0x2a2a2a, opacity: 1 },
      { distance: -100, height: 80, color: 0x1f1f1f, opacity: 0.8 },
      { distance: -150, height: 100, color: 0x141414, opacity: 0.6 },
      { distance: -200, height: 120, color: 0x0a0a0a, opacity: 0.4 }
    ];
    layers.forEach((layer, index) => {
      const points = [];
      const segments = 50;
      for (let i = 0; i <= segments; i++) {
        const x = (i / segments - 0.5) * 1000;
        const y = Math.sin(i * 0.1) * layer.height + Math.sin(i * 0.05) * layer.height * 0.5 + Math.random() * layer.height * 0.2 - 100;
        points.push(new THREE.Vector2(x, y));
      }
      points.push(new THREE.Vector2(5000, -300));
      points.push(new THREE.Vector2(-5000, -300));
      const shape = new THREE.Shape(points);
      const geometry = new THREE.ShapeGeometry(shape);
      const material = new THREE.MeshBasicMaterial({ color: layer.color, transparent: true, opacity: layer.opacity, side: THREE.DoubleSide });
      const mountain = new THREE.Mesh(geometry, material);
      mountain.position.z = layer.distance;
      mountain.position.y = layer.distance;
      mountain.userData = { baseZ: layer.distance, index };
      scene.add(mountain);
      mountainsList.push(mountain);
      mountainLocations.push(mountain.position.z);
    });
  };

  const createAtmosphere = () => {
    const geometry = new THREE.SphereGeometry(600, 32, 32);
    const material = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          // Grayscale atmosphere
          vec3 atmosphere = vec3(0.6, 0.6, 0.6) * intensity;
          float pulse = sin(time * 2.0) * 0.1 + 0.9;
          atmosphere *= pulse;
          gl_FragColor = vec4(atmosphere, intensity * 0.25);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    const atmosphere = new THREE.Mesh(geometry, material);
    scene.add(atmosphere);
  };

  createStarField();
  createNebula();
  createMountains();
  createAtmosphere();

  let targetCameraX = 0, targetCameraY = 30, targetCameraZ = 300;
  let smoothCameraX = 0, smoothCameraY = 30, smoothCameraZ = 100;
  
  let animationId;
  const animate = () => {
    animationId = requestAnimationFrame(animate);
    const time = Date.now() * 0.001;

    starsList.forEach(starField => {
      if (starField.material.uniforms) starField.material.uniforms.time.value = time;
    });
    if (nebula && nebula.material.uniforms) {
      nebula.material.uniforms.time.value = time * 0.5;
    }

    const smoothingFactor = 0.05;
    smoothCameraX += (targetCameraX - smoothCameraX) * smoothingFactor;
    smoothCameraY += (targetCameraY - smoothCameraY) * smoothingFactor;
    smoothCameraZ += (targetCameraZ - smoothCameraZ) * smoothingFactor;
    
    const floatX = Math.sin(time * 0.1) * 2;
    const floatY = Math.cos(time * 0.15) * 1;
    
    camera.position.x = smoothCameraX + floatX;
    camera.position.y = smoothCameraY + floatY;
    camera.position.z = smoothCameraZ;
    camera.lookAt(0, 10, -600);

    mountainsList.forEach((mountain, i) => {
      const parallaxFactor = 1 + i * 0.5;
      mountain.position.x = Math.sin(time * 0.1) * 2 * parallaxFactor;
      mountain.position.y = 50 + (Math.cos(time * 0.15) * 1 * parallaxFactor);
    });

    composer.render();
  };
  animate();

  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', handleResize);

  let currentSectionIndex = -1;

  // Scroll logic mapped to the container element instead of the entire document
  const handleScroll = () => {
    const rect = container.getBoundingClientRect();
    
    // We want scroll progress to map from 0 to 1 over the height of the hero-container minus one viewport height
    const scrollableDistance = container.offsetHeight - window.innerHeight;
    
    // How far we have scrolled past the top of the container
    const scrolledAmount = -rect.top;
    
    let progress = 0;
    if (scrolledAmount > 0) {
      progress = Math.min(scrolledAmount / scrollableDistance, 1);
    }
    
    if (rect.top > 0) progress = 0; // Above container
    if (rect.bottom < window.innerHeight) progress = 1; // Below container

    const totalProgress = progress * totalSections;
    const newSection = Math.min(Math.floor(totalProgress), totalSections - 1);
    const sectionProgress = totalProgress % 1;

    // Update UI elements
    progressFill.style.width = `${progress * 100}%`;
    sectionCounter.textContent = `0${newSection + 1} / 0${totalSections}`;

    // Handle section changes (trigger animations)
    if(newSection !== currentSectionIndex) {
      currentSectionIndex = newSection;
      
      sections.forEach((sec, idx) => {
        if (!sec) return;
        if (idx === newSection) {
          sec.style.opacity = '1';
          const chars = sec.querySelectorAll('.title-char');
          
          if(window.gsap) {
             window.gsap.fromTo(chars, 
                { y: 200, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 1.5, stagger: 0.05, ease: "power4.out", overwrite: true }
             );
          }
        } else {
          sec.style.opacity = '0';
        }
      });
    }

    const cameraPositions = [
      { x: 0, y: 30, z: 300 },    // Section 0
      { x: 0, y: 40, z: -50 },     // Section 1
      { x: 0, y: 50, z: -700 }     // Section 2
    ];

    const currentPos = cameraPositions[newSection] || cameraPositions[0];
    let nextPos = cameraPositions[newSection + 1] || currentPos;
    
    if (progress === 1) {
       nextPos = currentPos;
    }

    targetCameraX = currentPos.x + (nextPos.x - currentPos.x) * sectionProgress;
    targetCameraY = currentPos.y + (nextPos.y - currentPos.y) * sectionProgress;
    targetCameraZ = currentPos.z + (nextPos.z - currentPos.z) * sectionProgress;

    mountainsList.forEach((mountain, i) => {
      const speed = 1 + i * 0.9;
      const targetZ = mountain.userData.baseZ + scrolledAmount * speed * 0.5; 
      
      if (progress > 0.7) {
        mountain.position.z = 600000;
      } else {
        mountain.position.z = mountainLocations[i];
      }
    });
    if(nebula && mountainsList[3]) {
        nebula.position.z = mountainsList[3].position.z;
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // init
}

document.addEventListener('DOMContentLoaded', () => {
    initHero3D();
});
