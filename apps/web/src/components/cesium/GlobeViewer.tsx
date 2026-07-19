'use client';

import React, { useEffect, useRef } from 'react';
import { Viewer } from 'resium';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { Compass, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

// Configure Cesium Assets Base URL
if (typeof window !== 'undefined') {
  (window as any).CESIUM_BASE_URL = '/cesium';
  if (process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN) {
    Cesium.Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;
  }
}

// Initial viewpoint focusing on India
const INDIA_POSITION = Cesium.Cartesian3.fromDegrees(78.9629, 20.5937, 5000000);
const INDIA_ORIENTATION = {
  heading: Cesium.Math.toRadians(0.0),
  pitch: Cesium.Math.toRadians(-90.0),
  roll: Cesium.Math.toRadians(0.0),
};

interface GlobeViewerProps {
  children?: React.ReactNode;
}

export default function GlobeViewer({ children }: GlobeViewerProps) {
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    if (viewerRef.current?.cesiumElement) {
      const viewer = viewerRef.current.cesiumElement;
      
      // Set initial view to India
      viewer.camera.setView({
        destination: INDIA_POSITION,
        orientation: INDIA_ORIENTATION,
      });

      // Enable Day/Night lighting (Sun light source tracking)
      viewer.scene.globe.enableLighting = true;
      viewer.scene.highDynamicRange = true;
      viewer.scene.postProcessStages.fxaa.enabled = true;
    }
  }, []);

  // Camera Actions
  const handleZoomIn = () => {
    if (viewerRef.current?.cesiumElement) {
      const camera = viewerRef.current.cesiumElement.camera;
      camera.zoomIn(camera.positionCartographic.height * 0.3);
    }
  };

  const handleZoomOut = () => {
    if (viewerRef.current?.cesiumElement) {
      const camera = viewerRef.current.cesiumElement.camera;
      camera.zoomOut(camera.positionCartographic.height * 0.3);
    }
  };

  const handleResetCamera = () => {
    if (viewerRef.current?.cesiumElement) {
      const viewer = viewerRef.current.cesiumElement;
      viewer.camera.flyTo({
        destination: INDIA_POSITION,
        orientation: INDIA_ORIENTATION,
        duration: 1.5,
      });
    }
  };

  return (
    <div className="relative w-full h-full bg-[#06080D] overflow-hidden">
      {/* Dynamic Globe Component */}
      <Viewer
        ref={viewerRef}
        full
        timeline={false}
        animation={false}
        geocoder={false}
        baseLayerPicker={false}
        sceneModePicker={false}
        navigationHelpButton={false}
        infoBox={false}
        selectionIndicator={false}
        fullscreenButton={false}
        projectionPicker={false}
        className="w-full h-full [&_.cesium-viewer-bottom]:hidden"
      >
        {children}
      </Viewer>

      {/* Floating HUD Controller HUD overlay (Enterprise GIS style) */}
      <div className="absolute right-6 top-6 z-20 flex flex-col gap-3">
        <div className="flex flex-col rounded-lg border border-white/5 bg-[#0D1117]/85 backdrop-blur-md p-1.5 shadow-2xl">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="flex h-9 w-9 items-center justify-center rounded-md text-[#8A9BBB] hover:bg-white/5 hover:text-[#E8EAF0] active:scale-95 transition-all"
          >
            <ZoomIn className="h-4.5 w-4.5" />
          </button>
          
          <div className="h-px bg-white/5 my-1" />

          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="flex h-9 w-9 items-center justify-center rounded-md text-[#8A9BBB] hover:bg-white/5 hover:text-[#E8EAF0] active:scale-95 transition-all"
          >
            <ZoomOut className="h-4.5 w-4.5" />
          </button>

          <div className="h-px bg-white/5 my-1" />

          <button
            onClick={handleResetCamera}
            title="Reset Camera (India)"
            className="flex h-9 w-9 items-center justify-center rounded-md text-[#8A9BBB] hover:bg-white/5 hover:text-[#E8EAF0] active:scale-95 transition-all"
          >
            <RotateCcw className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="flex rounded-lg border border-white/5 bg-[#0D1117]/85 backdrop-blur-md p-2 text-[10px] font-mono tracking-wider text-[#8A9BBB] shadow-2xl items-center gap-1.5">
          <Compass className="h-3.5 w-3.5 text-[#E88C30] animate-pulse" />
          <span>WGS84 EPSG:4326</span>
        </div>
      </div>
    </div>
  );
}
