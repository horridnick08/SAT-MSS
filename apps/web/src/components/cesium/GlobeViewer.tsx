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

import CesiumEventManager from './CesiumEventManager';
import AoiDrawingLayer from './AoiDrawingLayer';
import AoiVertexEditor from './AoiVertexEditor';

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

      // Disable Day/Night lighting so satellite imagery is crisp, bright, and clearly visible at all times
      viewer.scene.globe.enableLighting = false;
      viewer.scene.highDynamicRange = false;
      viewer.scene.postProcessStages.fxaa.enabled = true;
      if (viewer.scene.fog) {
        viewer.scene.fog.enabled = false;
      }
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

  // High-resolution Google Satellite imagery (no 'data not available' issues on zoom)
  const baseLayer = React.useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    const token = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;
    if (token && token.trim().length > 0) {
      return undefined;
    }
    return new Cesium.ImageryLayer(
      new Cesium.UrlTemplateImageryProvider({
        url: 'https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        maximumLevel: 21,
        credit: 'Google Earth / Satellite',
      }),
    );
  }, []);

  const terrainProvider = React.useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    const token = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;
    if (token && token.trim().length > 0) {
      return undefined;
    }
    return new Cesium.EllipsoidTerrainProvider();
  }, []);

  const viewerProps: Record<string, any> = {
    ref: viewerRef,
    full: true,
    timeline: false,
    animation: false,
    geocoder: false,
    baseLayerPicker: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    infoBox: false,
    selectionIndicator: false,
    fullscreenButton: false,
    projectionPicker: false,
    className: 'w-full h-full [&_.cesium-viewer-bottom]:hidden',
  };

  if (baseLayer) {
    viewerProps.baseLayer = baseLayer;
  }
  if (terrainProvider) {
    viewerProps.terrainProvider = terrainProvider;
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#06080D]">
      {/* Dynamic Globe Component */}
      <Viewer {...viewerProps}>
        <CesiumEventManager />
        <AoiDrawingLayer />
        <AoiVertexEditor />
        {children}
      </Viewer>

      {/* Floating HUD Controller HUD overlay (Enterprise GIS style) */}
      <div className="absolute right-6 top-6 z-20 flex flex-col gap-3">
        <div className="flex flex-col rounded-lg border border-white/5 bg-[#0D1117]/85 p-1.5 shadow-2xl backdrop-blur-md">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="flex h-9 w-9 items-center justify-center rounded-md text-[#8A9BBB] transition-all hover:bg-white/5 hover:text-[#E8EAF0] active:scale-95"
          >
            <ZoomIn className="h-4.5 w-4.5" />
          </button>

          <div className="my-1 h-px bg-white/5" />

          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="flex h-9 w-9 items-center justify-center rounded-md text-[#8A9BBB] transition-all hover:bg-white/5 hover:text-[#E8EAF0] active:scale-95"
          >
            <ZoomOut className="h-4.5 w-4.5" />
          </button>

          <div className="my-1 h-px bg-white/5" />

          <button
            onClick={handleResetCamera}
            title="Reset Camera (India)"
            className="flex h-9 w-9 items-center justify-center rounded-md text-[#8A9BBB] transition-all hover:bg-white/5 hover:text-[#E8EAF0] active:scale-95"
          >
            <RotateCcw className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-[#0D1117]/85 p-2 font-mono text-[10px] tracking-wider text-[#8A9BBB] shadow-2xl backdrop-blur-md">
          <Compass className="h-3.5 w-3.5 animate-pulse text-[#E88C30]" />
          <span>WGS84 EPSG:4326</span>
        </div>
      </div>
    </div>
  );
}
