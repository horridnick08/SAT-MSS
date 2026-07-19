'use client';

import { useEffect } from 'react';
import { useCesium } from 'resium';
import * as Cesium from 'cesium';
import { useAoiStore } from '@/stores/useAoiStore';

export default function CesiumEventManager() {
  const { viewer } = useCesium();
  const isDrawing = useAoiStore((state) => state.isDrawing);
  const addVertex = useAoiStore((state) => state.addVertex);
  const updateTempPoint = useAoiStore((state) => state.updateTempPoint);
  const completeDrawing = useAoiStore((state) => state.completeDrawing);
  const cancelDrawing = useAoiStore((state) => state.cancelDrawing);

  useEffect(() => {
    if (!viewer) return;

    let handler: Cesium.ScreenSpaceEventHandler | null = null;

    if (isDrawing) {
      // 1. Temporarily disable camera navigation (panning/zooming) to avoid dragging during drawing
      const controller = viewer.scene.screenSpaceCameraController;
      controller.enableRotate = false;
      controller.enableTranslate = false;
      controller.enableZoom = false;
      controller.enableTilt = false;
      controller.enableLook = false;

      // 2. Initialize ScreenSpaceEventHandler for canvas interaction
      handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

      // LEFT_CLICK: Add coordinate vertex to store
      handler.setInputAction((event: { position: Cesium.Cartesian2 }) => {
        const ray = viewer.camera.getPickRay(event.position);
        if (!ray) return;
        
        let cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (!Cesium.defined(cartesian)) {
          cartesian = viewer.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid);
        }

        if (Cesium.defined(cartesian)) {
          addVertex(cartesian);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // MOUSE_MOVE: Track cursor to update the preview guide line
      handler.setInputAction((event: { endPosition: Cesium.Cartesian2 }) => {
        const ray = viewer.camera.getPickRay(event.endPosition);
        if (!ray) return;

        let cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (!Cesium.defined(cartesian)) {
          cartesian = viewer.camera.pickEllipsoid(event.endPosition, viewer.scene.globe.ellipsoid);
        }

        if (Cesium.defined(cartesian)) {
          updateTempPoint(cartesian);
        } else {
          updateTempPoint(null);
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      // LEFT_DOUBLE_CLICK: Close and finalize the polygon shape
      handler.setInputAction(() => {
        completeDrawing();
      }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    } else {
      // Reset normal map camera controls
      const controller = viewer.scene.screenSpaceCameraController;
      controller.enableRotate = true;
      controller.enableTranslate = true;
      controller.enableZoom = true;
      controller.enableTilt = true;
      controller.enableLook = true;
    }

    return () => {
      if (handler) {
        handler.destroy();
      }
      if (viewer && !viewer.isDestroyed()) {
        const controller = viewer.scene.screenSpaceCameraController;
        controller.enableRotate = true;
        controller.enableTranslate = true;
        controller.enableZoom = true;
        controller.enableTilt = true;
        controller.enableLook = true;
      }
    };
  }, [viewer, isDrawing, addVertex, updateTempPoint, completeDrawing]);

  // Listen to Escape key to cancel drawing
  useEffect(() => {
    if (!isDrawing) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        cancelDrawing();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawing, cancelDrawing]);

  return null;
}
