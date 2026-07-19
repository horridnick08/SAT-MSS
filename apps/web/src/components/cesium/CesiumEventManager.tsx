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
  const selectedAoiId = useAoiStore((state) => state.selectedAoiId);
  const selectAoi = useAoiStore((state) => state.selectAoi);
  const cancelEditing = useAoiStore((state) => state.cancelEditing);

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
      // If we are not drawing, we want to allow picking saved polygons to edit
      // and clicking empty space to deselect
      handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

      handler.setInputAction((event: { position: Cesium.Cartesian2 }) => {
        const pickedObject = viewer.scene.pick(event.position);
        if (
          Cesium.defined(pickedObject) &&
          pickedObject.id &&
          typeof pickedObject.id.id === 'string' &&
          pickedObject.id.id.startsWith('saved-aoi-')
        ) {
          const id = pickedObject.id.id.replace('saved-aoi-', '');
          selectAoi(id);
        } else if (
          Cesium.defined(pickedObject) &&
          pickedObject.id &&
          typeof pickedObject.id.id === 'string' &&
          pickedObject.id.id.startsWith('edit-vertex-')
        ) {
          // Clicked a vertex handle while editing - do not deselect
          return;
        } else {
          // Clicked empty space: deselect the current selected AOI (if any)
          selectAoi(null);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // Reset camera controls to active
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
  }, [viewer, isDrawing, addVertex, updateTempPoint, completeDrawing, selectAoi]);

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

  // Listen to Escape key to cancel editing
  useEffect(() => {
    if (!selectedAoiId) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        cancelEditing();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedAoiId, cancelEditing]);

  return null;
}
