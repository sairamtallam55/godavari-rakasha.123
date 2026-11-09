/**
 * Godavari Raksha - Godavari Digital Twin and 3D Simulation Centre (Module 10)
 * Procedural 3D Virtual Environment of Rajamahendravaram Riverfront, Ghats,
 * Havelock Rail Bridge, River Flow, Crowd Heat Zones, and Emergency Scenarios
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useApp } from '../../context/AppContext';
import { Box, Eye, Layers, Compass, RotateCcw, AlertTriangle, Shield, Play, Pause, ChevronUp, ChevronDown, Check } from 'lucide-react';

export const DigitalTwin3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { ghats, incidents, simulationScenarios } = useApp();

  const [activePreset, setActivePreset] = useState<'overview' | 'pushkar' | 'kotilingala' | 'bridge'>('overview');
  const [showCrowdHeat, setShowCrowdHeat] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('SIM-001');
  const [isSimulating, setIsSimulating] = useState(false);
  const [hudCollapsed, setHudCollapsed] = useState(false);
  const [waterLevelOffset, setWaterLevelOffset] = useState<number>(0);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const incidentGroupRef = useRef<THREE.Group | null>(null);
  const crowdHeatGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 900;
    const height = container.clientHeight || 550;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060d1a);
    scene.fog = new THREE.FogExp2(0x060d1a, 0.007);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 500);
    camera.position.set(0, 45, 75);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio lighting rig
    const ambientLight = new THREE.AmbientLight(0x2a3b5c, 1.2);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x4070a0, 0x1a2638, 1.0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff0dd, 2.0);
    dirLight.position.set(40, 60, 30);
    dirLight.castShadow = !isSoftwareGl;
    if (dirLight.shadow) {
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.bias = -0.0005;
    }
    scene.add(dirLight);

    // -------------------------------------------------------------
    // PROCEDURAL 3D ENVIRONMENT CREATION
    // -------------------------------------------------------------

    // 1. Terrain & Riverbed
    const terrainGeo = new THREE.PlaneGeometry(240, 160, 32, 32);
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x1b2738,
      roughness: 0.9,
      metalness: 0.1,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.rotation.x = -Math.PI / 2;
    terrainMesh.position.y = -0.5;
    terrainMesh.receiveShadow = !isSoftwareGl;
    scene.add(terrainMesh);

    // 2. Godavari River Water Mesh
    const waterGeo = new THREE.PlaneGeometry(160, 140, 48, 48);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0a4c7a,
      roughness: 0.15,
      metalness: 0.75,
      transparent: true,
      opacity: 0.88,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.set(-20, 0, 0);
    scene.add(waterMesh);
    waterMeshRef.current = waterMesh;

    // 3. Ghat Terraced Steps (Kotilingala & Pushkar Ghats)
    const ghatGroup = new THREE.Group();
    const stepColor = 0xb89d7c;
    const ghatStoneMat = new THREE.MeshStandardMaterial({
      color: stepColor,
      roughness: 0.75,
      metalness: 0.1,
    });

    for (let i = 0; i < 10; i++) {
      const stepGeo = new THREE.BoxGeometry(60, 0.6, 2.5);
      const stepMesh = new THREE.Mesh(stepGeo, ghatStoneMat);
      stepMesh.position.set(35 + i * 1.5, i * 0.5, -20);
      stepMesh.castShadow = !isSoftwareGl;
      stepMesh.receiveShadow = !isSoftwareGl;
      ghatGroup.add(stepMesh);
    }

    // Pushkar Ghat steps (south side)
    for (let i = 0; i < 10; i++) {
      const stepGeo = new THREE.BoxGeometry(70, 0.6, 2.5);
      const stepMesh = new THREE.Mesh(stepGeo, ghatStoneMat);
      stepMesh.position.set(32 + i * 1.5, i * 0.5, 30);
      stepMesh.castShadow = !isSoftwareGl;
      stepMesh.receiveShadow = !isSoftwareGl;
      ghatGroup.add(stepMesh);
    }
    scene.add(ghatGroup);

    // 4. Temple Vimana / Tower Architecture (Kotilingala Shiva Temple)
    const templeGroup = new THREE.Group();
    templeGroup.position.set(52, 5, -20);

    const baseGeo = new THREE.BoxGeometry(14, 6, 14);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x8a7055, roughness: 0.8 });
    const templeBase = new THREE.Mesh(baseGeo, baseMat);
    templeGroup.add(templeBase);

    // Tiered Vimana spire
    for (let t = 0; t < 5; t++) {
      const tierSize = 12 - t * 2.2;
      const tierGeo = new THREE.BoxGeometry(tierSize, 2, tierSize);
      const tierMat = new THREE.MeshStandardMaterial({ color: 0x9e8060, roughness: 0.7 });
      const tierMesh = new THREE.Mesh(tierGeo, tierMat);
      tierMesh.position.y = 3 + t * 2;
      templeGroup.add(tierMesh);
    }
    const kalasamGeo = new THREE.ConeGeometry(1.2, 3, 8);
    const kalasamMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });
    const kalasam = new THREE.Mesh(kalasamGeo, kalasamMat);
    kalasam.position.y = 14.5;
    templeGroup.add(kalasam);
    scene.add(templeGroup);

    // 5. Historic Havelock Rail Bridge (Spanning Godavari)
    const bridgeGroup = new THREE.Group();
    bridgeGroup.position.set(-20, 7, 5);

    // Steel Girder Deck
    const bridgeDeckGeo = new THREE.BoxGeometry(150, 1.2, 5);
    const bridgeMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
    const bridgeDeck = new THREE.Mesh(bridgeDeckGeo, bridgeMat);
    bridgeGroup.add(bridgeDeck);

    // Stone Support Piers
    const pierMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.85 });
    for (let p = -5; p <= 5; p++) {
      const pierGeo = new THREE.CylinderGeometry(2, 2.5, 12, 12);
      const pierMesh = new THREE.Mesh(pierGeo, pierMat);
      pierMesh.position.set(p * 14, -5.5, 0);
      bridgeGroup.add(pierMesh);

      // Steel Arch Truss above each span
      const archGeo = new THREE.TorusGeometry(6, 0.4, 6, 12, Math.PI);
      const archMesh = new THREE.Mesh(archGeo, bridgeMat);
      archMesh.position.set(p * 14, 0.6, 0);
      bridgeGroup.add(archMesh);
    }
    scene.add(bridgeGroup);

    // 6. SDRF Patrol Rescue Boats on Water
    const boatGroup = new THREE.Group();
    boatGroup.position.set(-15, 0.4, -10);

    const hullGeo = new THREE.BoxGeometry(4.5, 1.2, 1.8);
    const hullMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.3 });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    boatGroup.add(hull);

    const cabinGeo = new THREE.BoxGeometry(1.8, 1.4, 1.4);
    const cabinMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(-0.5, 1.1, 0);
    boatGroup.add(cabin);

    scene.add(boatGroup);

    // 7. Crowd Flow & Density Indicators Group
    const crowdGroup = new THREE.Group();
    crowdHeatGroupRef.current = crowdGroup;

    // Heat circles on Pushkar & Kotilingala
    const pushkarHeatGeo = new THREE.RingGeometry(2, 16, 32);
    const pushkarHeatMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.38,
      side: THREE.DoubleSide,
    });
    const pushkarHeat = new THREE.Mesh(pushkarHeatGeo, pushkarHeatMat);
    pushkarHeat.rotation.x = -Math.PI / 2;
    pushkarHeat.position.set(38, 2.6, 30);
    crowdGroup.add(pushkarHeat);

    const kotiHeatGeo = new THREE.RingGeometry(2, 14, 32);
    const kotiHeatMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const kotiHeat = new THREE.Mesh(kotiHeatGeo, kotiHeatMat);
    kotiHeat.rotation.x = -Math.PI / 2;
    kotiHeat.position.set(38, 2.6, -20);
    crowdGroup.add(kotiHeat);

    scene.add(crowdGroup);

    // 8. 3D Emergency Markers Group
    const incGroup = new THREE.Group();
    incidentGroupRef.current = incGroup;

    incidents.slice(0, 6).forEach((inc, idx) => {
      const pinGroup = new THREE.Group();
      // map coordinates roughly onto local 3D scale
      const posX = 30 + (idx % 2 === 0 ? 5 : -4);
      const posZ = idx * 10 - 25;
      pinGroup.position.set(posX, 4.5, posZ);

      const sphereGeo = new THREE.SphereGeometry(1.2, 12, 12);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: inc.priority === 'CRITICAL' ? 0xdc2626 : 0xf59e0b,
        emissive: inc.priority === 'CRITICAL' ? 0x991b1b : 0xd97706,
        roughness: 0.2,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      pinGroup.add(sphere);

      const stemGeo = new THREE.CylinderGeometry(0.15, 0.15, 3.5);
      const stemMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.y = -1.8;
      pinGroup.add(stem);

      incGroup.add(pinGroup);
    });
    scene.add(incGroup);

    // -------------------------------------------------------------
    // INTERACTIVE MOUSE / TOUCH DRAG CAMERA CONTROLS
    // -------------------------------------------------------------
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0.5;
    let distance = 85;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotY -= deltaX * 0.008;
      targetRotX = Math.max(0.1, Math.min(Math.PI / 2.2, targetRotX + deltaY * 0.008));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      distance = Math.max(30, Math.min(140, distance + e.deltaY * 0.08));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Animation & Render Loop
    let clock = new THREE.Clock();
    const animate = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Procedural water waves simulation
      if (waterMeshRef.current) {
        const geo = waterMeshRef.current.geometry as THREE.PlaneGeometry;
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const u = pos.getX(i);
          const v = pos.getY(i);
          const z = Math.sin(u * 0.1 + time * 1.8) * 0.35 + Math.cos(v * 0.12 + time * 1.5) * 0.25;
          pos.setZ(i, z);
        }
        pos.needsUpdate = true;
      }

      // Gentle boat bobbing
      boatGroup.position.y = 0.4 + Math.sin(time * 2.2) * 0.18;
      boatGroup.rotation.z = Math.sin(time * 1.5) * 0.04;

      // Camera positioning with damping
      camera.position.x = THREE.MathUtils.damp(camera.position.x, Math.sin(targetRotY) * Math.cos(targetRotX) * distance, 4, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, Math.sin(targetRotX) * distance, 4, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, Math.cos(targetRotY) * Math.cos(targetRotX) * distance, 4, delta);
      camera.lookAt(10, 2, 0);

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [ghats, incidents]);

  // Camera presets
  const applyPreset = (preset: 'overview' | 'pushkar' | 'kotilingala' | 'bridge') => {
    setActivePreset(preset);
    if (!cameraRef.current) return;
    if (preset === 'overview') {
      cameraRef.current.position.set(0, 50, 80);
    } else if (preset === 'pushkar') {
      cameraRef.current.position.set(30, 25, 45);
    } else if (preset === 'kotilingala') {
      cameraRef.current.position.set(32, 24, -35);
    } else if (preset === 'bridge') {
      cameraRef.current.position.set(-20, 28, 25);
    }
  };

  // Toggle crowd layer
  useEffect(() => {
    if (crowdHeatGroupRef.current) {
      crowdHeatGroupRef.current.visible = showCrowdHeat;
    }
  }, [showCrowdHeat]);

  // Toggle incident markers
  useEffect(() => {
    if (incidentGroupRef.current) {
      incidentGroupRef.current.visible = showIncidents;
    }
  }, [showIncidents]);

  return (
    <div className="relative w-full h-[calc(100vh-7.5rem)] min-h-[550px] bg-slate-950 flex flex-col overflow-hidden">
      
      {/* Top Left Spec / Attribution Badge (§5 Minimal Title) */}
      <div className="absolute top-4 left-4 z-20 pointer-events-auto bg-slate-900/90 border border-slate-700/80 rounded-lg p-3 text-slate-200 shadow-xl max-w-sm">
        <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
          <Box className="w-4 h-4" />
          Godavari Digital Twin Engine
        </div>
        <div className="text-sm font-bold text-white mt-0.5">
          Rajamahendravaram Riverfront 3D
        </div>
        <div className="text-[11px] text-slate-400 mt-1 leading-snug">
          Real-time spatial twin simulating Godavari flow, Pushkaralu bathing ghat steps, Havelock Bridge, and crowd flow bottlenecks.
        </div>
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
          <span>Camera: Interactive Orbit</span>
          <span>·</span>
          <span>Simulation Mode: Active</span>
        </div>
      </div>

      {/* Main 3D Viewport (100% Unobstructed Center) */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Collapsible Unified Bottom Control Dock (§5 Ergonomic Layout) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-4xl transition-all duration-300">
        
        {/* Collapse / Expand Toggle Button */}
        <div className="flex justify-center -mb-2">
          <button
            onClick={() => setHudCollapsed(!hudCollapsed)}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700/80 rounded-t-lg text-xs font-medium shadow-md transition-colors"
          >
            {hudCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{hudCollapsed ? 'Show Twin Controls' : 'Hide Controls (Zen Mode)'}</span>
          </button>
        </div>

        {/* The Dock Card */}
        {!hudCollapsed && (
          <div className="bg-slate-900/95 border border-slate-700/90 rounded-xl p-3.5 shadow-2xl text-slate-200 backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-4">
              
              {/* Camera Presets */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-teal-400" />
                  View:
                </span>
                <button
                  onClick={() => applyPreset('overview')}
                  className={`px-2.5 py-1 text-xs rounded transition-colors ${
                    activePreset === 'overview' ? 'bg-teal-600 text-white font-semibold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => applyPreset('pushkar')}
                  className={`px-2.5 py-1 text-xs rounded transition-colors ${
                    activePreset === 'pushkar' ? 'bg-teal-600 text-white font-semibold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Pushkar Ghat
                </button>
                <button
                  onClick={() => applyPreset('kotilingala')}
                  className={`px-2.5 py-1 text-xs rounded transition-colors ${
                    activePreset === 'kotilingala' ? 'bg-teal-600 text-white font-semibold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Kotilingala
                </button>
                <button
                  onClick={() => applyPreset('bridge')}
                  className={`px-2.5 py-1 text-xs rounded transition-colors ${
                    activePreset === 'bridge' ? 'bg-teal-600 text-white font-semibold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Havelock Rail
                </button>
              </div>

              {/* Layers Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCrowdHeat(!showCrowdHeat)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border transition-colors ${
                    showCrowdHeat
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Crowd Density
                </button>

                <button
                  onClick={() => setShowIncidents(!showIncidents)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border transition-colors ${
                    showIncidents
                      ? 'bg-red-500/20 text-red-300 border-red-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Emergencies ({incidents.filter((i) => i.status !== 'RESOLVED').length})
                </button>
              </div>

              {/* Simulation Drill Launcher */}
              <div className="flex items-center gap-2">
                <select
                  value={activeScenarioId}
                  onChange={(e) => setActiveScenarioId(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  {simulationScenarios.map((sc) => (
                    <option key={sc.id} value={sc.id}>
                      {sc.title}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded transition-colors shadow-sm ${
                    isSimulating
                      ? 'bg-red-600 hover:bg-red-500 text-white'
                      : 'bg-teal-600 hover:bg-teal-500 text-white'
                  }`}
                >
                  {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isSimulating ? 'Pause Scenario' : 'Run Drill'}</span>
                </button>
              </div>

            </div>

            {/* Active Simulation Status Banner */}
            {isSimulating && (
              <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-amber-300">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Simulating:</span>
                  <span className="text-white">
                    {simulationScenarios.find((s) => s.id === activeScenarioId)?.title}
                  </span>
                </div>
                <div className="font-mono text-[11px] text-slate-400">
                  Speed: 1.0x Realtime · Impact: 85,000 Pilgrims
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
